// # Execute using: npm install && npm run createOrg
import OS2 from './lowLevelOs.js';
import SFDX from './sfdx.js';
import Colors2 from './colors.js';
import { parse } from 'jsonc-parser';

const config = {
	errors: [],
	cicd: false,
	debug: false,
	verbose: false,
	resultsTofile: true,
	checkUrlExists: true,
	executeManualChecks: false,
	deployPage: '/lightning/setup/DeployStatus/home',
	steps: [
		// No parameters sent, then do everything
		'mainRunJest',
		'mainBackupAlias',
		'mainCreateScratchOrg',
		'mainPauseToCheck',
		'mainOpenDeployPage',
		'mainPrepareOrg',
		'mainManualMetadataBefore',
		'mainExecuteApexBeforePush',
		'mainInstallPackages',
		// mainDeploy (Do not do a deploy, rather do a push)
		'mainPushMetadata',
		'mainManualMetadataAfter',
		'mainExecuteApexAfterPush',
		'mainAssignPermissionSet',
		'mainDeployAdminProfile',
		'mainLoadData',
		'mainExecuteApexAfterData',
		'mainRunApexTests',
		// mainPushAgain
		// mainReassignAlias
		'mainPublishCommunity',
		'mainGeneratePassword',
		'mainDeployToSandbox',
		'QuitSuccess',
	],
};

export default class OrgBuilder {
	root = null;
	sfdx;

	async start() {
		Colors2.clearScreen();
		config.cicd = !!process.env.ET_CICD;
		this.sfdx = new SFDX(config);
		this.root = await OS2.getFullPath({ config, relativePath: '.' });
		await this._readConfigFile();
		await OS2.recreateFolder({ config, path: './etLogs' });
		await this.sfdx.validateETCopyData({ config });
	}

	async _readConfigFile() {
		Colors2.writeInstruction({ msg: 'Reading configuration file' });
		let configFileName = await OS2.getFullPath({ config, relativePath: './@ELTOROIT/scripts/nodejs/orgBuilder.jsonc' });
		let configJSONC = await OS2.readFile({ config, path: configFileName });
		config.SFDX = parse(configJSONC);
	}
}

let ob = new OrgBuilder();
ob.start();
