require 'dotenv/tasks'

namespace :site do
  desc 'Clean up the site directory'
  task :clean do
	  `rm -r _site`
  end

  desc 'Build the Jekyll site'
  task :build do
    `jekyll build`
  end

  desc 'Upload'
  task :upload => :dotenv do
	  exec "rsync -avz --copy-links --del _site/ #{ENV['WEBSITE_USER']}:#{ENV['WEBSITE_PATH']}"
  end

  desc 'reload'
  task :reload => [ :clean, :build, :upload ] do
    puts "uploading site changes"
  end

  desc 'review'
  task :serve do
    exec "jekyll serve -wD"
  end

  desc 'serve'
  task :server do
    exec "jekyll serve -w"
  end
end
