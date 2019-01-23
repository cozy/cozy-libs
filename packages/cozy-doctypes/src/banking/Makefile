encrypted.tar.gz.gpg: __snapshots__/matching-accounts.spec.js.snap fixtures.enc
	tar cvz __snapshots__/matching-accounts.spec.js.snap fixtures | gpg -co encrypted.tar.gz.gpg

clean:
	rm -rf __snapshots__/matching-accounts.spec.js.snap fixtures.enc
