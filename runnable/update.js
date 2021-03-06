var child_process = require('child_process')

function exec(command)
{
	return child_process.execSync(command).toString().trim()
}

var metadata_changed = exec('git ls-files --modified PhoneNumberMetadata.xml')

if (!metadata_changed)
{
	console.log()
	console.log('========================================')
	console.log('=   Metadata is up-to-date. Exiting.   =')
	console.log('========================================')
	console.log()

	// The absense of the `update-metadata` branch will tell the script
	// that the metadata is up-to-date and doesn't need updating
	console.log(exec('git checkout master'))
	console.log(exec('git branch -D update-metadata'))
	process.exit(0)
}

console.log()
console.log('========================================')
console.log('= Metadata has changed, updating files =')
console.log('========================================')
console.log()

console.log(exec('npm run metadata:generate'))

console.log()
console.log('========================================')
console.log('=             Running tests            =')
console.log('========================================')
console.log()

console.log(exec('npm test'))

var modified_files = exec('git ls-files --modified').split(/\s/)

if (modified_files.length > 2)
{
	console.log()
	console.log('========================================')
	console.log('=                 Error                =')
	console.log('========================================')
	console.log()
	console.log('Only `PhoneNumberMetadata.xml` and `metadata.min.json` should be modified.')
	console.log()
	console.log(modified_files.join('\n'))

	process.exit(1)
}

// http://stackoverflow.com/questions/33610682/git-list-of-staged-files
var staged_files = exec('git diff --name-only --cached').split(/\s/)

if (staged_files.length > 0)
{
	console.log()
	console.log('========================================')
	console.log('=                 Error                =')
	console.log('========================================')
	console.log()
	console.log('There are some staged files already. Aborting metadata update process.')
	console.log()
	console.log(staged_files.join('\n'))

	process.exit(1)
}

console.log()
console.log('========================================')
console.log('=          Committing changes          =')
console.log('========================================')
console.log()

console.log(exec('git add PhoneNumberMetadata.xml metadata.min.json'))

console.log(exec('git commit -m "Phone number medatada update"'))
console.log(exec('git push'))

console.log()
console.log('========================================')
console.log('=               Finished               =')
console.log('========================================')