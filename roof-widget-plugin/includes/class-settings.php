<?php
/**
 * Settings storage. The config is stored as a structured array and handed to the
 * widget as JSON via the shortcode. Defaults live in the JS bundle (brand-neutral
 * DEFAULT_CONFIG); a fresh install stores nothing and the widget renders defaults.
 *
 * @package BordiWidgets\RoofSystem
 */

namespace BordiWidgets\RoofSystem;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Settings {

	const OPTION = 'bordi_widgets_roof_system_config';

	/** @var Settings|null */
	private static $instance = null;

	private function __construct() {}

	public static function instance(): Settings {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/** Saved config (possibly partial). Empty array means "use JS defaults". */
	public function get_config(): array {
		$config = get_option( self::OPTION, array() );
		return is_array( $config ) ? $config : array();
	}

	public function update_config( array $config ): void {
		update_option( self::OPTION, $config );
	}

	/** Recursively sanitize an incoming config tree (strings, scalars only). */
	public function sanitize( array $config ): array {
		return self::sanitize_node( $config );
	}

	/**
	 * @param mixed $value
	 * @return mixed
	 */
	private static function sanitize_node( $value ) {
		if ( is_array( $value ) ) {
			$out = array();
			foreach ( $value as $key => $item ) {
				// Preserve key CASE — the config schema is camelCase (dotX,
				// colorPrimary, frameCountMode, …). sanitize_key() lowercases and
				// would break it; just strip anything outside [A-Za-z0-9_].
				$clean_key         = is_string( $key ) ? preg_replace( '/[^A-Za-z0-9_]/', '', $key ) : $key;
				$out[ $clean_key ] = self::sanitize_node( $item );
			}
			return $out;
		}
		if ( is_string( $value ) ) {
			return sanitize_text_field( $value );
		}
		if ( is_bool( $value ) || is_int( $value ) || is_float( $value ) ) {
			return $value;
		}
		return null; // drop anything unexpected
	}
}
