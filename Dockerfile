FROM circleci/ruby:2.6.6-node-browsers

WORKDIR /app

# Copy all the Gemfile files
COPY Gemfile* ./

RUN bundle install
RUN BUNDLE_GEMFILE=Gemfile.next bundle install

# Add a script to be executed every time the container starts.
COPY bin/entrypoint.sh /usr/bin/
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# Configure the main process to run when running the image
CMD ["rails", "server", "-b", "0.0.0.0"]
