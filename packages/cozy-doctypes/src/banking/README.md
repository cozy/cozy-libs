## Banking doctypes

This repository contains models used for banking applications. It also contains
matching/deduplication logic for bank accounts and bank transactions.

### Encrypted tests

Account matching necessitates real world data for its tests. After
anonymizing the data, it has been encrypted to further increase
security and privacy.

To run the tests (you'll need a password for the decryption step): 

```bash
cd packages/cozy-doctypes
yarn decrypt-banking-tests # JSON fixtures and a Jest snapshot will be decrypted
yarn test # The matching.spec.js will be able to run its tests
```

To update the tests:

```bash
# Update the snapshots and/or fixtures
cd packages/cozy-doctypes
make encrypted.tar.gz.gpg
git add encrypted.tar.gz.gpg
make clean # remove the fixtures and snaps
```
