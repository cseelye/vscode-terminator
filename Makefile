
publish:
	vsce package && vsce publish

clean:
	$(RM) *.vsix
