<?php
/**
 * Shared REST helpers. Every widget route registers through here so no endpoint
 * can forget its capability check.
 *
 * @package BordiWidgets\Core
 */

namespace BordiWidgets\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Rest {

	/**
	 * Permission callback: administrators only.
	 *
	 * Authentication/nonce is handled by WordPress core for cookie-authenticated
	 * REST requests (the admin app sends the `X-WP-Nonce` header via wp.apiFetch);
	 * this callback is the authorization layer.
	 */
	public static function require_admin(): bool {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Register a REST route with the admin capability check baked in unless the
	 * caller supplies its own permission_callback.
	 *
	 * @param string $namespace e.g. "bordi-widgets/v1".
	 * @param string $route     e.g. "/roof-system/settings".
	 * @param array  $args      Standard register_rest_route args.
	 */
	public static function register( string $namespace, string $route, array $args ): void {
		if ( isset( $args[0] ) && is_array( $args[0] ) ) {
			// A list of endpoint definitions — inject the check into each one.
			foreach ( $args as $i => $endpoint ) {
				if ( is_array( $endpoint ) && empty( $endpoint['permission_callback'] ) ) {
					$args[ $i ]['permission_callback'] = array( self::class, 'require_admin' );
				}
			}
		} elseif ( empty( $args['permission_callback'] ) ) {
			$args['permission_callback'] = array( self::class, 'require_admin' );
		}
		register_rest_route( $namespace, $route, $args );
	}
}
