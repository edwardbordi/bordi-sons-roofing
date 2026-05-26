<?php
/**
 * Admin settings page. Enqueues the React settings bundle (which reads React
 * from the Core global and talks to the REST routes via wp.apiFetch) and prints
 * the mount point. Rendered inside Core's "Bordi Widgets" shell.
 *
 * @package BordiWidgets\RoofSystem
 */

namespace BordiWidgets\RoofSystem;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use BordiWidgets\Core\Enqueue as CoreEnqueue;

final class Admin {

	const HANDLE = 'roof-system-admin';

	/** @var Admin|null */
	private static $instance = null;

	private function __construct() {}

	public static function instance(): Admin {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/** Registered as the widget's `admin_render` callback in Core's registry. */
	public function render(): void {
		$this->enqueue();
		echo '<div class="wrap">';
		echo '<h1>' . esc_html__( 'Roof System Widget', 'roof-system-widget' ) . '</h1>';
		echo '<div id="roof-system-admin-root"></div>';
		echo '</div>';
	}

	/** Enqueued only here, so the settings bundle loads only on this admin page. */
	private function enqueue(): void {
		// Make sure the shared React global is registered (it's our dependency).
		CoreEnqueue::instance()->register_react();

		wp_enqueue_script(
			self::HANDLE,
			RSW_URL . 'assets/dist/admin.js',
			array( CoreEnqueue::react_handle(), 'wp-api-fetch' ),
			RSW_VERSION,
			true
		);
	}
}
