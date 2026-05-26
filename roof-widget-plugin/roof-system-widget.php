<?php
/**
 * Plugin Name:       Roof System Widget
 * Description:       Scroll-driven, fully-configurable "roof anatomy" widget. Drop it on any page via the [roof_system] shortcode and style it from Bordi Widgets → Roof System.
 * Version:           0.1.0
 * Requires PHP:      7.4
 * Requires at least: 6.0
 * Requires Plugins:  bordi-widgets-core
 * Author:            Bordi Widgets
 * License:           GPL-2.0-or-later
 * Text Domain:       roof-system-widget
 *
 * @package BordiWidgets\RoofSystem
 */

namespace BordiWidgets\RoofSystem;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

define( 'RSW_VERSION', '0.1.0' );
define( 'RSW_FILE', __FILE__ );
define( 'RSW_DIR', plugin_dir_path( __FILE__ ) );
define( 'RSW_URL', plugin_dir_url( __FILE__ ) );

require_once RSW_DIR . 'includes/class-settings.php';
require_once RSW_DIR . 'includes/class-license.php';
require_once RSW_DIR . 'includes/class-enqueue.php';
require_once RSW_DIR . 'includes/class-shortcode.php';
require_once RSW_DIR . 'includes/class-rest.php';
require_once RSW_DIR . 'includes/class-admin.php';

/** Core must be present and loaded (it provides the React global + registry). */
function core_ready(): bool {
	return class_exists( '\\BordiWidgets\\Core\\Registry' );
}

/**
 * Boot. Runs after Core (Core loads first alphabetically and registers on the
 * default `plugins_loaded` priority; we use a later priority to be safe).
 */
function init() {
	if ( ! core_ready() ) {
		add_action( 'admin_notices', __NAMESPACE__ . '\\core_missing_notice' );
		return;
	}

	Enqueue::instance()->register();
	Shortcode::instance()->register();
	Rest::instance()->register();

	// Announce ourselves to Core so we get a "Bordi Widgets → Roof System" page,
	// rendered by the React settings app (Admin::render).
	\BordiWidgets\Core\Registry::instance()->register(
		'roof-system',
		array(
			'title'        => __( 'Roof System', 'roof-system-widget' ),
			'admin_render' => array( Admin::instance(), 'render' ),
		)
	);
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\\init', 20 );

/** Admin notice shown when the required Core plugin is missing. */
function core_missing_notice() {
	echo '<div class="notice notice-error"><p>';
	echo esc_html__( 'Roof System Widget requires the "Bordi Widgets Core" plugin to be installed and active.', 'roof-system-widget' );
	echo '</p></div>';
}
