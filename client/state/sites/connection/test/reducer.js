/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import { useSandbox } from 'test/helpers/use-sinon';
import {
	SITE_CONNECTION_STATUS_RECEIVE,
	SITE_CONNECTION_STATUS_REQUEST,
	SITE_CONNECTION_STATUS_REQUEST_FAILURE,
	SITE_CONNECTION_STATUS_REQUEST_SUCCESS,
	SERIALIZE,
	DESERIALIZE
} from 'state/action-types';
import reducer, { items, requesting } from '../reducer';

describe( 'reducer', () => {
	useSandbox( ( sandbox ) => {
		sandbox.stub( console, 'warn' );
	} );

	it( 'should export expected reducer keys', () => {
		expect( reducer( undefined, {} ) ).to.have.keys( [
			'items',
			'requesting',
		] );
	} );

	describe( '#items()', () => {
		it( 'should default to an empty object', () => {
			const state = items( undefined, {} );

			expect( state ).to.eql( {} );
		} );

		it( 'should store connection status when received', () => {
			const state = items( undefined, {
				type: SITE_CONNECTION_STATUS_RECEIVE,
				siteId: 2916284,
				status: true,
			} );

			expect( state ).to.eql( {
				2916284: true,
			} );
		} );

		it( 'should accumulate connection statuses when receiving for new sites', () => {
			const original = deepFreeze( {
				2916284: true
			} );
			const state = items( original, {
				type: SITE_CONNECTION_STATUS_RECEIVE,
				siteId: 77203074,
				status: false,
			} );

			expect( state ).to.eql( {
				2916284: true,
				77203074: false,
			} );
		} );

		it( 'should overwrite connection status when receiving for an existing site', () => {
			const original = deepFreeze( {
				2916284: true,
				77203074: false,
			} );
			const state = items( original, {
				type: SITE_CONNECTION_STATUS_RECEIVE,
				siteId: 2916284,
				status: false,
			} );

			expect( state ).to.eql( {
				2916284: false,
				77203074: false,
			} );
		} );

		it( 'should not persist state', () => {
			const original = deepFreeze( {
				2916284: true
			} );
			const state = items( original, { type: SERIALIZE } );

			expect( state ).to.eql( {} );
		} );

		it( 'should not load persisted state', () => {
			const original = deepFreeze( {
				2916284: true
			} );
			const state = items( original, { type: DESERIALIZE } );

			expect( state ).to.eql( {} );
		} );
	} );

	describe( 'requesting()', () => {
		it( 'should default to an empty object', () => {
			const state = requesting( undefined, {} );

			expect( state ).to.eql( {} );
		} );

		it( 'should track connection status request when started', () => {
			const state = requesting( undefined, {
				type: SITE_CONNECTION_STATUS_REQUEST,
				siteId: 2916284
			} );

			expect( state ).to.eql( {
				2916284: true
			} );
		} );

		it( 'should accumulate connection status requests when started', () => {
			const original = deepFreeze( {
				2916284: true
			} );
			const state = requesting( original, {
				type: SITE_CONNECTION_STATUS_REQUEST,
				siteId: 77203074
			} );

			expect( state ).to.eql( {
				2916284: true,
				77203074: true
			} );
		} );

		it( 'should track connection status request when succeeded', () => {
			const original = deepFreeze( {
				2916284: true,
				77203074: true
			} );
			const state = requesting( original, {
				type: SITE_CONNECTION_STATUS_REQUEST_SUCCESS,
				siteId: 2916284
			} );

			expect( state ).to.eql( {
				2916284: false,
				77203074: true
			} );
		} );

		it( 'should track connection status request when failed', () => {
			const original = deepFreeze( {
				2916284: false,
				77203074: true
			} );
			const state = requesting( original, {
				type: SITE_CONNECTION_STATUS_REQUEST_FAILURE,
				siteId: 77203074
			} );

			expect( state ).to.eql( {
				2916284: false,
				77203074: false
			} );
		} );
	} );
} );
