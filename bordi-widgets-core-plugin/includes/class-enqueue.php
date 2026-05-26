<?php
/**
 * Registers the shared React global so widget plugins can depend on it.
 * Exposes window.BordiWidgetsCore.React / .ReactDOM on the page.
 *
 * @package BordiWidgets\Core
 */

namespace BordiWidgets\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Enqueue {

	const REACT_HANDLE = 'bordi-widgets-react';

	/** @var Enqueue|null */
	private static $instance = null;

	private function __construct() {}

	public static function instance(): Enqueue {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function register(): void {
		// Priority 1 so the handle exists before widget plugins enqueue against it.
		add_action( 'wp_enqueue_scripts', array( $this, 'register_react' ), 1 );
		add_action( 'admin_enqueue_scripts', array( $this, 'register_react' ), 1 );
	}

	/** Register (not enqueue) the React global; widgets list it as a dependency. */
	public function register_react(): void {
		if ( wp_script_is( self::REACT_HANDLE, 'registered' ) ) {
			return;
		}
		wp_register_script(
			self::REACT_HANDLE,
			BORDI_WIDGETS_CORE_URL . 'assets/dist/react-global.js',
			array(),
			BORDI_WIDGETS_CORE_VERSION,
			true
		);
	}

	/** Script handle widget plugins declare as a dependency. */
	public static function react_handle(): string {
		return self::REACT_HANDLE;
	}
}
