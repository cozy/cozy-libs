encrypted.tar.gz.gpg: __snapshots__/matching.spec.js.snap fixtures
	tar cvz __snapshots__/matching.spec.js.snap fixtures | gpg -co encrypted.tar.gz.gpg

clean:
	rm -rf __snapshots__/matching.spec.js.snap fixtures
