SRC = rbt.js
DIST = dist/rbt.js
MIN_DIST = dist/rbt.min.js

JSX = ./node_modules/.bin/jsx
SPEC = ./spec/rbt.spec.js
UGLIFY = ./node_modules/.bin/uglifyjs
JASMINE = ./node_modules/.bin/jasmine-node

$(DIST) $(MIN_DIST): $(SRC)
	@$(JSX) --harmony --strip-types $< > $(DIST)
	@$(UGLIFY) $(DIST) -c -m > $(MIN_DIST)

dist: $(DIST) $(MIN_DIST)

test: $(DIST)
	@$(JASMINE) $(SPEC)

flow:
	@flow check

.PHONY: dist flow test
