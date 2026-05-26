<?php
/**
 * Widget registry — the seam between Core and the paid widget plugins.
 *
 * @package BordiWidgets\Core
 */

namespace BordiWidgets\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Each widget plugin calls Registry::instance()->register() on `plugins_loaded`
 * to announce itself (title + how to render its admin panel). Core reads the
 * registry to build the admin menu.
 */
final class Registry {

	/** @var Registry|null */
	private static $instance = null;

	/** @var array<string,array> */
	private $widgets = array();

	private function __construct() {}

	public static function instance(): Registry {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Register a widget.
	 *
	 * @param string $id   Unique slug, e.g. "roof-system".
	 * @param array  $args {
	 *     @type string        $title        Human label for the admin menu.
	 *     @type callable|null  $admin_render Renders the widget's admin page (mount point).
	 * }
	 */
	public function register( string $id, array $args ): void {
		$this->widgets[ $id ] = wp_parse_args(
			$args,
			array(
				'title'        => $id,
				'admin_render' => null,
			)
		);
	}

	/** @return array<string,array> */
	public function all(): array {
		return $this->widgets;
	}

	/** @return array|null */
	public function get( string $id ) {
		return $this->widgets[ $id ] ?? null;
	}
}
