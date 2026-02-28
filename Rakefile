require 'fileutils'

namespace :site do
  desc 'Clean up the site directory'
  task :clean do
    FileUtils.rm_rf('_site')
  end

  desc 'Build the Jekyll site'
  task :build do
    sh 'bundle exec jekyll build'
  end

  desc 'Clean and build'
  task reload: %i[clean build]

  desc 'Serve drafts locally'
  task :serve do
    sh 'bundle exec jekyll serve -H 0.0.0.0 -wD'
  end

  desc 'Serve site locally'
  task :server do
    sh 'bundle exec jekyll serve -H 0.0.0.0 -w'
  end

  desc 'generate new post as `rake site:new "Title" "category"`'
  task :new do
    args = ARGV.map do |arg|
      task arg.to_sym do; end
      arg.to_s
    end

    time = Time.now
    _, title, category = args

    if title && category
      puts "\tTitle: #{title}\n\tCategory: #{category}\n\tTime: #{time}"

      front_matter = File.open('_includes/front.template.jekyll', 'r') do |f|
        template = f.read
        template = template.gsub '{{DATE}}', time.to_s
        template = template.gsub '{{TITLE}}', title
        template = template.gsub '{{CATEGORY}}', category
        template
      end

      filename = "#{time.strftime '%Y-%m-%d'}-#{title.downcase}".gsub(' ', '-')
      file = "_drafts/#{filename}.markdown"
      File.open(file, 'w') do |f|
        f.puts front_matter
      end

      sh "git add #{file}"
    else
      puts 'Usage: rake site:new ${TITLE} ${CATEGORY}'
    end
  end
end
