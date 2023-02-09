#!/bin/bash

curl -o- https://raw.githubusercontent.com/transifex/cli/master/install.sh | bash
install -m0644 .transifexrc.tpl ~/.transifexrc
echo "token = $TX_TOKEN" >> ~/.transifexrc
