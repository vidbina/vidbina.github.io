#require 'dotenv/tasks'

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
  #task :upload => :dotenv do
	#  exec "rsync -avz --copy-links --del _site/ #{ENV['WEBSITE_USER']}:#{ENV['WEBSITE_PATH']}"
  #end

  desc 'reload'
  task :reload => [ :clean, :build, :upload ] do
    puts "uploading site changes"
  end

  desc 'review'
  task :serve do
    exec "jekyll serve -H 0.0.0.0 -wD "
  end

  desc 'server'
  task :server do
    exec "jekyll serve -H 0.0.0.0 -w"
  end

  desc 'generate new post as `rake site:new "Title" "category"`'
  task :new do
    ARGV.each do |arg| 
      p "arg is #{arg}"
      task arg.to_sym do; end
    end
    args = ARGV

    time = Time.now
    title = args[1]
    category = args[2]
    args.shift
    if title and category
      p "title is #{title} category is #{category}"

      front_matter = File.open('_includes/front.template.jekyll', 'r') do |f|
        template = f.read
        template = template.gsub '{{DATE}}', time.to_s
        (template = template.gsub '{{TITLE}}', title) if title
        (template = template.gsub '{{CATEGORY}}', category) if category
        template
      end

      filename = "#{time.strftime '%Y-%m-%d'}-#{title.downcase}".gsub ' ', '-'
      file = "_drafts/#{filename}.markdown"
      File.open(file, "w") do |f|
        f.puts front_matter
      end

      exec "git add #{file}"
    end
  end
end
