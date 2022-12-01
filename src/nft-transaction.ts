import { Base64 } from '@tonconnect/protocol';
import { Address, beginCell, contractAddress as calculateContractAddress, Cell, StateInit } from 'ton';

const OFFCHAIN_CONTENT_PREFIX = 0x01;
const nftUri = 'https://raw.githubusercontent.com/siandreev/nft/main/demo-nft-data.json';

const contractCode =
	'b5ee9c7201020d010001dd000114ff00f4a413f4bcf2c80b0102016202030202cc0405000ba11f9fe00e6302012006070023d8264659fa801e78b00e78b659fe664f6aa402ddd1910e380492f81f068698180b8d8492f81f07d207d2018fd0018b8eb90fd0018fd0018780382d9c7099899999aa909e382f970ca817d206a180978047003e98fe99f9141082fe61e8a5d4746190824081b88130822816d9e7018191a1a1a9ac10817e593515d71812f824207f978408090201580b0c01f65136c705f2e191fa4021f006fa40d20031fa000b820afaf080a121945315a0a1de22d70b01c300209206a19136e220c2fff2e192218e3e821005138d91c8500acf16500ccf1671244a145446b0708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb00105894102b385be20a00727082108b77173505c8cbff5004cf1610248040708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb000080028e3427f00647408210d53276db016d71708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb0093303335e25503f00800113e910c30003cb8536000493b513434cffe900835d27080271fc07e9034cff50c040d440d381c1b40b4cfcc0510cc1b60';
const initCodeCell = Cell.fromBoc(contractCode)[0];

const serializeUri = (uri: string): Uint8Array => {
	return new TextEncoder().encode(encodeURI(uri));
};

const createOffchainUriCell = (uri: string) => {
	return beginCell()
		.storeUint(OFFCHAIN_CONTENT_PREFIX, 8)
		.storeBuffer(Buffer.from(serializeUri(uri)))
		.endCell();
};

function generateInitialData(ownerAddressHex: string): Cell {
	const nftContent = createOffchainUriCell(nftUri);

	const builder = beginCell()
		.storeUint(0, 64)
		.storeUint(0, 2)
		.storeAddress(Address.parseRaw(ownerAddressHex))
		.storeUint(Date.now(), 64)
		.storeRef(nftContent);

	return builder.endCell();
}

function generateStateInit(data: Cell): string {
	const stateInit = new StateInit({ code: initCodeCell, data });
	const cell = new Cell();
	stateInit.writeTo(cell);

	return callToBase64(cell);
}

function callToBase64(cell: Cell): string {
	return Base64.encode(cell.toBoc());
}

function generateContractAddress(initDataCell: Cell): string {
	return calculateContractAddress({
		workchain: 0,
		initialData: initDataCell,
		initialCode: initCodeCell,
	}).toString();
}

export function getAddressAndStateInit(ownerAddress: string): { address: string; stateInit: string } {
	const initialData = generateInitialData(ownerAddress);
	const address = generateContractAddress(initialData);
	const stateInit = generateStateInit(initialData);
	return { address, stateInit };
}

export function generatePayload(sendTo: string): string {
	const op = 0x5fcc3d14; // transfer
	const quiryId = 0;
	const messageBody = beginCell()
		.storeUint(op, 32)
		.storeUint(quiryId, 64)
		.storeAddress(Address.parse(sendTo))
		.storeUint(0, 2)
		.storeInt(0, 1)
		.storeCoins(0)
		.endCell();

	return Base64.encode(messageBody.toBoc());
}

export function getRawAddress(userFriendlyAddress: string): string {
	return Address.parse(userFriendlyAddress).toString();
}
