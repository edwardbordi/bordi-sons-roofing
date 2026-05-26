<?php
/**
 * License key storage + status. The real validation server / update gating is a
 * later phase (SPEC.md §15, P8); this is the minimal client surface.
 *
 * @package BordiWidgets\RoofSystem
 */

namespace BordiWidgets\RoofSystem;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class License {

	const OPTION = 'bordi_widgets_roof_system_license';

	/** @var License|null */
	private static $instance = null;

	private function __construct() {}

	public static function instance(): License {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function key(): string {
		return (string) get_option( self::OPTION, '' );
	}

	public function set_key( string $key ): void {
		update_option( self::OPTION, sanitize_text_field( $key ) );
	}

	/**
	 * Whether the install is licensed. Stub: presence of a key. Real subscription
	 * validation against the license server lands in P8 — the widget keeps
	 * working if a subscription lapses; only updates are gated.
	 */
	public function is_active(): bool {
		return '' !== $this->key();
	}
}
