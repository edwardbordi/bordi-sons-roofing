<?php
/**
 * Conditional asset loading. The widget bundle is only enqueued on pages that
 * actually use the widget (the shortcode/block calls ensure()). It reads React
 * from the Core global, so Core's React script is declared as a dependency.
 *
 * @package BordiWidgets\RoofSystem
 */

namespace BordiWidgets\RoofSystem;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use BordiWidgets\Core\Enqueue as CoreEnqueue;

final class Enqueue {

	const HANDLE = 'roof-system-widget';

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
		add_action( 'wp_enqueue_scripts', array( $this, 'register_assets' ), 5 );
	}

	/** Register (not enqueue) the widget bundle, depending on the Core React global. */
	public function register_assets(): void {
		$this->register_script();
	}

	private function register_script(): void {
		if ( wp_script_is( self::HANDLE, 'registered' ) ) {
			return;
		}
		wp_register_script(
			self::HANDLE,
			RSW_URL . 'assets/dist/widget.js',
			array( CoreEnqueue::react_handle() ),
			RSW_VERSION,
			true
		);
	}

	public static function handle(): string {
		return self::HANDLE;
	}

	/**
	 * Enqueue the widget bundle. Called when a widget is actually present on the
	 * page (from the shortcode/block render). Safe to call during the_content —
	 * footer scripts are printed afterward. The Core React dependency enqueues
	 * automatically.
	 */
	public static function ensure(): void {
		$self = self::instance();
		$self->register_script();
		wp_enqueue_script( self::HANDLE );
	}
}
