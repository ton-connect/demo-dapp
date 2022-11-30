import { Base64 } from '@tonconnect/protocol';
import { Address, beginCell, contractAddress as calculateContractAddress, Cell } from 'ton';

const OFFCHAIN_CONTENT_PREFIX = 0x01;
const nftUri = 'https://raw.githubusercontent.com/siandreev/nft/main/nft-data.json';

const serializeUri = (uri: string): Uint8Array => {
	return new TextEncoder().encode(encodeURI(uri));
};

const createOffchainUriCell = (uri: string) => {
	return beginCell()
		.storeUint(OFFCHAIN_CONTENT_PREFIX, 8)
		.storeBuffer(Buffer.from(serializeUri(uri)))
		.endCell();
};

export function generateInitialData(ownerAddressHex: string): Cell {
	const nftContent = createOffchainUriCell(nftUri);

	const builder = beginCell()
		.storeUint(0, 64)
		.storeUint(0, 2)
		.storeAddress(Address.parseRaw(ownerAddressHex))
		.storeRef(nftContent);

	return builder.endCell();
}

export function callToBase64(cell: Cell): string {
	return Base64.encode(cell.toBoc());
}

export function generateContractAddress(initDataCell: Cell): string {
	const contractCode =
		'b5ee9c7201020d010001d0000114ff00f4a413f4bcf2c80b0102016202030202cc04050009a11f9fe00f0201200607001dd81e4659fac678b00e78b6664f6aa402d9d1910e380492f81f068698180b8d8492f81f07d207d2018fd0018b8eb90fd0018fd001878038259c70a1836111a29196382f970ca80fd206a180811f8047003698fe99f9141082fe61e8a5d474499081baf192009ed9e70181a1a1a9a80c10817e593515d71812f824207f978408090201580b0c01f65135c705f2e191fa4021f006fa40d20031fa000a820afaf080a121945315a0a1de22d70b01c300209206a19136e220c2fff2e192218e3e821005138d91c85009cf16500bcf16712449145446a0708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb00104794102a375be20a00727082108b77173505c8cbff5004cf1610248040708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb000080028e3426f00646308210d53276db016d71708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb0093303234e25502f00800113e910c30003cb85360003b3b513434cffe900835d27080269fc07e90350c04090408f80c1c165b5b60';
	const initCodeCell = Cell.fromBoc(contractCode)[0];

	return calculateContractAddress({
		workchain: 0,
		initialData: initDataCell,
		initialCode: initCodeCell,
	}).toString();
}
