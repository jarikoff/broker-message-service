## Installation
1. Copy `.env.example` to `.env`
2. Run `docker-compose up --build`

## Playground
1. Service are configured to receive message from exchanges that already exists (other service create it`s topic to send messages)
2. Open default.yml and check topic name which should be created (or use default one - `amq.topic`)
3. Open `http://localhost:15672` - there's an admin UI panel for RabbitMQ (if u've changed port in `.env` - set u'r own port agter localhost)
4. Pass credentials which defined in `.env` file to get access to admin panel
5. Open queue which u defined in `default.yml` (`client_actions_queue` by default) and send a valid JSON as a message: routing key defined in default.yml as well (we listen `client.actions.*` by default) and list of route postfixes (*) defined in ClientBuilder (name property)
6. Contracts for valid JSON described in src -> entities -> requests.
7. Open console to see logs of working service
