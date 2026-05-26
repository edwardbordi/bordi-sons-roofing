<?php
/**
 * REST routes for reading/saving the widget config. Registered through Core's
 * Rest helper so the admin-only capability check is enforced automatically.
 *
 * @package BordiWidgets\RoofSystem
 */

namespace BordiWidgets\RoofSystem;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use BordiWidgets\Core\Rest as CoreRest;
use WP_REST_Request;

final class Rest {

	const REST_NS = 'bordi-widgets/v1';
	const ROUTE   = '/roof-system/settings';

	/** @var Rest|null */
	private static $instance = null;

	private function __construct() {}

	public static function instance(): Rest {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function register(): void {
		add_action( 'rest_api_init', array( $this, 'routes' ) );
	}

	public function routes(): void {
		CoreRest::register(
			self::REST_NS,
			self::ROUTE,
			array(
				array(
					'methods'  => 'GET',
					'callback' => array( $this, 'get_settings' ),
				),
				array(
					'methods'  => 'POST',
					'callback' => array( $this, 'save_settings' ),
				),
			)
		);
	}

	public function get_settings() {
		return rest_ensure_response( Settings::instance()->get_config() );
	}

	public function save_settings( WP_REST_Request $request ) {
		$body  = $request->get_json_params();
		$clean = Settings::instance()->sanitize( is_array( $body ) ? $body : array() );
		Settings::instance()->update_config( $clean );

		return rest_ensure_response(
			array(
				'saved'  => true,
				'config' => $clean,
			)
		);
	}
}
