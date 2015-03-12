Configure flannel by specifying the CIDR of the subnetting scheme.
Set the `/coreos.com/network/config` key with the appropriate CIDR

Create new machines subscribing to the etcd service which contains the flannel 
config

Observe the `/coreos.com/network/subnets` etcd directory. This should be updated
for every server that joins the cluster.

From a network containing the following machines with the ip addresses
$10$.$x\_1$.$y\_1$.$z\_1$,
$20$.$x\_2$.$y\_2$.$z\_2$,
$30$.$x\_3$.$y\_3$.$z\_3$ 
and $40$.$x\_4$.$y\_4$.$z\_4$.

flannel may setup the following scheme

```bash
$ etcdctl ls /coreos.com/network/subnets
/coreos.com/network/subnets/10.240.A.0-24
/coreos.com/network/subnets/10.240.B.0-24
/coreos.com/network/subnets/10.240.C.0-24
/coreos.com/network/subnets/10.240.D.0-24
```

note how every machine is assigned a range of addresses and is placed within 
the same subnet `10.240.X.X`.

In order to determine which machine is assigned to which subnet, we may 
introspect the individual entries inside the `/coreos.com/network/subnets`
directory and study the IP addresses recorded for the key `PublicIP`.

```bash
$ etcdctl get /coreos.com/network/subnets/10.240.A.0\-24
{"PublicIP":"10.X1.Y1.Z1"}
$ etcdctl get /coreos.com/network/subnets/10.240.B.0\-24
{"PublicIP":"10.X3.Y3.Z3"}
$ etcdctl get /coreos.com/network/subnets/10.240.C.0\-24
{"PublicIP":"10.X2.Y2.Z2"}
$ etcdctl get /coreos.com/network/subnets/10.240.D.0\-24
{"PublicIP":"10.X4.Y4.Z4"}

Within every machine one may discover the related flannel subnet by 
introspecting the `/run/flannel/subnet.env` file.

```bash
FLANNEL_SUBNET=10.240.C.1/24
FLANNEL_MTU=N
```
# Errors
Use `journalctl` to examine the logs

Upon supplying a invalid CIDR for the subnet the following error appears:
```
Mar 12 16:20:30 box.example.internal gce-coreos-cloudinit[539]: 2015/03/12 16:20:30 Calling unit command "start" on "docker.service"'
Mar 12 16:20:30 box.example.internal systemd[1]: Starting flannel is an etcd backed overlay network for containers...
Mar 12 16:20:30 box.example.internal wget[639]: --2015-03-12 16:20:30--  http://storage.googleapis.com/k8s/flanneldMar 12 16:20:30 box.example.internal systemd[1]: Starting flannel is an etcd backed overlay network for containers...
Mar 12 16:20:30 box.example.internal wget[639]: Resolving storage.googleapis.com... SOME_IP_ADDR, 2a00:1450:400c:c03::84
Mar 12 16:20:30 box.example.internal wget[639]: Connecting to storage.googleapis.com|SOME_IP_ADDR|:80... connected.
Mar 12 16:20:30 box.example.internal wget[639]: HTTP request sent, awaiting response... 200 OK
Mar 12 16:20:30 box.example.internal wget[639]: Length: 7784547 (7.4M) [binary/octet-stream]
Mar 12 16:20:30 box.example.internal wget[639]: Server file no newer than local file '/opt/bin/flanneld' -- not retrieving.
Mar 12 16:20:35 box.example.internal flanneld[642]: E0312 16:20:35.806771 00642 main.go:137] Failed to create SubnetManager: invalid CIDR address: 10.200/16
```

