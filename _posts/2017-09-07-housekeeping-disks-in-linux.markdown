---
layout: post
title: Housekeeping Disk in Linux
description: |
  Just a primer :pill: on the basic tools :wrench: and terminal-fu that come in
  handy in housekeeping disks :floppy_disk: in Linux :penguin:.
date:  2017-09-07 11:00:08 +0000
type: storage # for icon
category: tools # for url
tags:
 - tools
 - storage
 - media
 - ssd
 - disk
 - LUKS
 - ext3
 - ext4
 - btrfs
 - zfs
og:
  type: article # http://ogp.me/#types
#  og:type: #
#   - og:value: value
#     og:attr: foo
#   - og:value: value
#image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/brexit.png
#twitter:
#  card: summary
#  image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/brexit.png
head: mugshot
emojify: true
---
# Basics

List the block devices

    lsblk

List all the known partitions

    fdisk -l

Figure out sizes of directories, only recursing to a depth of 1 levels deep

    du -d 1 -h /

## Partitions

One may create partition tables on a disk using `fdisk` as demonstrated in the
screencast below.

<div class="element screencast">
  <script src="https://asciinema.org/a/ubDxMlMqWFOq7UtalLFFPhF7P.js" id="asciicast-ubDxMlMqWFOq7UtalLFFPhF7P" async></script>
</div>

An unencrypted partition is easily accessible by mounting the block device.
Encrypted partitions, however; would need to be unlocked first which would
subsequently yield a mapping which is mountable. Understanding this order of
steps makes the entire ordeal much easier to reason about -- encrypted volumes
need to be unlocked prior to them even being mountable :thought_balloon:.

For a brief overview, the following list captures the step involved in the
usage of a volume where :key: marks the steps required with encrypted volumes
and :construction: marks the steps required only at the setup of a volume:

 - luksFormat: prep volume for encryption :key: :construction:
 - format volume to a filesystem :construction:
 - unlock/luksOpen :key:
 - mount
 - read/write
 - unmount
 - lock/luksClose :key:

The snippet below lists the output of `lsblk /dev/sda` which provides an
some insights as to how an LUKS encrypted volume `sda1` relates to its
non-encrypted counterpart `sda2`.

```
NAME                 MAJ:MIN RM   SIZE RO TYPE  MOUNTPOINT
sda                    8:0    0 476.9G  0 disk
├─sda1                 8:1    0   300G  0 part
│ └─luks-xyz
│                    254:4    0   300G  0 crypt /run/media/a
└─sda2                 8:2    0 176.9G  0 part  /run/media/b
```

<div class="element note">
Note that both volumes in the lsblk listing are mounted. In order to arrive at
a scenario that is somewhat similar to the one presented in the listing above,
I'll mention how to format unencrypted and encrypted volumes and mount these in
the sections that follow :point_down:.
</div>

### Basic (Unencrypted)

Formatting partition `/dev/sda2` to the ext3 filesystem may be done as follows

    sudo mkfs.ext3 /dev/sda2

which is a command that you probably wouldn't need on a day to day basis but
is still fundamental enough to be worth remembering. :star:

Once a volume is formatted, it may be mounted by

    sudo mount /dev/sda2/ /my/mountpoint

which will mount the disk to `/my/mountpoint` or

    udisksctl mount -b /dev/sda2

which will mount the the block device designated by the flag `-b` and referred
to as `/dev/sda2` to a mountpoint set up by udisksctl and subsequently printed
to the terminal after the mount is completed.

Unmount block device `/dev/sda2` by running

    sudo umount /dev/sda2

or by running

    udisksctl unmount -b /dev/sda2

where `-b` indicates that the token that follows represents the reference to
the block device we intend to unmount.

<div class="element note">
:bulb: Note how `udisksctl` works without `sudo`. If at all possible, I avoid
using `sudo` as much as I can :wink:[^sudo].
</div>

[^sudo]: Using `sudo` and fainting a few seconds later effectively leaves a terminal that will probably allow unfettered sudo foolery for the next 50-odd seconds or so exposed to the next person walking by. :boom: This is bad, M'kay?!?

### Encrypted

One may setup encryption on partition `/dev/sda1` by using the `cryptsetup`
tool as follows

    sudo cryptsetup luksFormat /dev/sda1

which will completely wipe the data off the partition, request a passphrase and
subsequently prep the volume for use as -- an encrypted volume. :raised_hands:

At this stage we have setup a partition to be used with LUKS encryption.  There
is no filesystem (ext3, btrfs, zfs, or whatever) setup on the volume yet so
don't get confused by the "format" in "luksFormat", the drive isn't really
formatted for a specific filesystem yet.

In order to use our partition we need to unlock it by

    sudo cryptsetup luksOpen /dev/sda1 some-alias

which will request a passphrase :key:, open the the volume
and map it to the arbitrary name `some-alias`, or

    udisksctl unlock -b /dev/sda1

which will request a passphrase and unlock the device, subsequently returning
the path to which the volume was mapped (e.g.: `/dev/dm-x`).

Now that the volume is unlocked, one may treat the mapping as a conventional
drive -- fit for formatting, mounting, reading, writing and unmounting. :floppy_disk:

From this point on, one may use the mapping reference `/dev/dm-x` in a similar
manner as we used the block device reference `/dev/sda2` in the examples to
format the unencrypted volume. So now you know how to format, mount and unmount
the encrypted volume as well. :wink:

An unmounted disk is still exposed until it is locked again, so when done
don't forget to lock the device by either running

    sudo cryptsetup luksClose some-alias

where the alias is provided that the volume was opened as, or

    udisksctl lock -b /dev/sda1

which is hopefully self-explantory at this stage.

<div class="element note">
:bulb: Learning how to use `udisksctl` makes life slightly easier since you can
use the same tool for unlocking, mount, unmounting and ejecting medium which
basically covers your entire day-to-day disk usage workflow. Without
`udisksctl` one would otherwise have to remember how to use `cryptsetup
luksOpen`, `mount` , `umount` along with a method for safely unplugging the
storage device and the worst part is that one would need to elevate itself to
sudo privileges to run these commands whereas `udisksctl` just works without
any special privileges :wink:. The biggest downside to udisksctl is that I
haven't figured out how to explicitly provide custom mountpoints while invoking
the command.
</div>

A great feature of udisksctl is that it makes it pretty easy to safely
disconnect or eject a medium from a system. Running

    udisksctl power-off -b /dev/sda

allows one to disconnect the entire device `/dev/sda`. Note that I didn't use
the path to a partition, but the path to the entire device. This is basically
the eject switch to use with your removable media. :rocket::seat:

## Backups

This section will cover some basic strategies for handling backups. None of
these methods are very robust, but unless you find something better this could
at least be a start-up strategy for you personal computing needs. :wink:

### For storage on unencrypted medium

Create `-c` an archive of my home directory `~`, using the bzip2 filter `-j`,
and output this archive's contents to stdout. Pipe this data through gpg to
encrypt it with a symmetric cipher `-c` and redirect the ciphertext to a file
in `/tmp/mountpoint` matching the pattern `backup_*.tbz2.gpg` where `*`
represents the date at which the archive was created.

    tar cjf - ~ | gpg --ciper-algo AES -c - > /tmp/mountpoint/backup_`date +"%Y%m%d%H%M"`.tbz2.gpg

<div class="element note">
NOTE: In my case, this produces a tarball over 100G in size, which I would have
to unpack in its entirety and decrypt in order to do anything useful with it.
So, it's a rather sluggish way to handle backups. On the flipside, you have a
single file that captures the entire state of your home directory which is
pretty easy to handle.
</div>

Read the archive, pipe it through gpg which pipes the plaintext to stdout where
we decompress `-d` the bzip2 `-j` archive all with the following command:

    cat backup_DATE.tbz2.gpg | gpg - | tar djf -

### For storage on encrypted medium

Archive `-a` sync a file with [rsync][wiki-rsync], which basically preserves
everything except hardlinks, presents information in a human-readable format
`-h` and provides a nifty progress report `--progress` and could be entered
into the terminal as follows

    rsync -ah --progress $SOURCE $DESTINATION

where `$SOURCE` represents the directory you want arhived, and `$DESTINATION`
represents the mountpoint of the encrypted volume, or a directory within the
encrypted volume.

Subsequent execution of the rsync command as presented above will basically
update the backup at `$DESTINATION`, only when the files have different
timestamps and sizes. This makes it an light solution for creating backups as
we only fully read the files that have changed from the source and write them
to the destination rather than writing the entire `$SOURCE` into `$DESTINATION`.

An even smoother approach is to make incremental backups by using the last back
up as reference to link against using the rsync `--link-dest` argument.
Basically, `--link-dest` allows one to create a directory tree hard-linking all
unchanged files and copying all changed files. Since unchanged files are simply
hardlinked they only occupy disk space once for every iteration or version.
The following command

    rsync -aPh --link-dest=$LAST_BACKUP $SRC $NEW_BACKUP

where `$LAST_BACKUP` represents the path of the last backup to link against,
`$NEW_BACKUP` represents the path of the new backup to produce and `$SRC`
(e.g. `~`) represents the directory to backup should be enough to the backup
job done. :trophy:

<!--
--compare-dest compares files between sender and destination machine compare
directories to determine if a local (on destination machine) copy could be used
instead of a transfer from sender to destination. If the sender files are
different from the compare directory files, a copy is made.
--copy-dest like --compare-dest but will also copy **unchanged** files from
destination copy using local copy.
--link-dest like --copy-dest but hard-links **unchanged** files
-->

## Troubleshooting

LUKS volumes can be configured to use 8 keys for unlocking the device, these
keys can be provided as passphrases or as files. Besides the 8 keys, the volume
will have a master key which could be used without the use of any of the 8 keys
as the "master key" to unlock the volume.

Use `luksDump` to produce an overview of the state of the 8 keyslots.

    sudo cryptsetup luksDump /dev/sda1

Without any of the 8 keys or the master key you are "out of LUKS" as Ramesh
nicely put in his post [10 Linux cryptsetup Examples for LUK Key Management][10-cryptsetup-examples].

It's probably a good practice to keep a dump of the master key somewhere locked
in a :fire: fireproof safe in a nuclear shelter, just in case you forget your
keyphrases. :lock_with_ink_pen:

    sudo cryptsetup luksDump --dump-master-key /dev/sda1 > master.key

### Modifying a key when one of the other keys is known

If a volume is unlocked, one may remove a forgotten key by using the
`luksKillSlot` command, provided that at least one of the other keys is know
as the user will be prompted for one functional key in order to perform the
`luksKillSlot` operation. In order to remove the key in slot 1 for the volume
on `/dev/sda1`, for example, one could execute

    sudo cryptsetup luksKillSlot /dev/sda1 1

and enter the passphrase for the key in any other slot :wink:.

<div class="element note">
The machine will not allow you to remove a key with the key to be removed.
That's how people get locked out. :sob:
</div>

Adding a key into slot 1 could easily be accomplished by running the following
command

    sudo cryptsetup luksAddKey /dev/sda1 -S 1

which, in combination with the former command, represents a decent approach in
changing the key in slot 1.

### Modifying a key when the master key is known

In order to remove or change keys to a LUKS volume, one would need access to
the master key for a volume which may be obtained from the device mapper setup
tool. The following command will output the table for the selected device and
present the encryption key in the represented table (the fifth field to be
precise)

    dmsetup table --showkeys /dev/dm-x

but bundling in as follows

    --master-key-file <(dmsetup table --showkeys $VOLUME | awk '{ print $5 }' | xxd -r -p)

to form the `--master-key-file` argument which can be used with every
`cryptsetup` command that requires a key.

<div class="element note">
:bulb: The `<(COMMAND)` syntax is an instance of [process
substitution][tldp-proc-sub], where a `/dev/fd/*` file is used to send stdout
as a file to another process.
</div>

# Links

 - [10 Linux cryptsetup Examples for LUKS Key Management (How to Add, Remove, Change, Reset LUKS encryption Key) by Ramesh Natarajan][10-cryptsetup-examples]
 - [Change password on a LUKS filesystem without knowing the password][so-161915]
 - [cryptsetup FAQ on gitlab][cryptsetup-faq]
 - [Gentoo wiki: Dm-crypt full disk encryption][gentoo-wiki-dmcrypt]
 - [How to decrypt LUKS with the known master key?][so-119803]
 - [LINFO: Journaling Filesystem Definition][journaling]
 - [Wikipedia: rsync][rsync-wiki]
 - [Wikipedia: Trim (computing)][wiki-trim]
 - [xkcd on password strength][xkcd-pass-strength]

[gentoo-wiki-dmcrypt]: https://wiki.gentoo.org/wiki/Dm-crypt_full_disk_encryption
[su-bzip_vs_gzip]: https://superuser.com/questions/205223/pros-and-cons-of-bzip-vs-gzip
[xkcd-pass-strength]: https://xkcd.com/936/
[cryptsetup-faq]: https://gitlab.com/cryptsetup/cryptsetup/wikis/FrequentlyAskedQuestions
[wiki-trim]: https://en.wikipedia.org/wiki/Trim_(computing)
[journaling]: http://www.linfo.org/journaling_filesystem.html
[so-119803]: https://unix.stackexchange.com/questions/119803/how-to-decrypt-luks-with-the-known-master-key#119832
[so-161915]:https://unix.stackexchange.com/questions/161915/change-password-on-a-luks-filesystem-without-knowing-the-password#161920
[10-cryptsetup-examples]: https://www.thegeekstuff.com/2016/03/cryptsetup-lukskey
[rsync-wiki]: https://en.wikipedia.org/wiki/Rsync
[tldp-proc-sub]: http://www.tldp.org/LDP/abs/html/process-sub.html#PROCESSSUBREF
