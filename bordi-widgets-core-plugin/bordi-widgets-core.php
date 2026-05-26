<?php
/**
 * Plugin Name:       Bordi Widgets Core
 * Description:       Foundation for Bordi Widgets — provides React, the admin shell, a widget registry, and shared REST utilities. Required by Bordi widget plugins.
 * Version:           0.1.0
 * Requires PHP:      7.4
 * Requires at least: 6.0
 * Author:            Bordi Widgets
 * License:           GPL-2.0-or-later
 * Text Domain:       bordi-widgets-core
 *
 * @package BordiWidgets\Core
 */

namespace BordiWidgets\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

define( 'BORDI_WIDGETS_CORE_VERSION', '0.1.0' );
define( 'BORDI_WIDGETS_CORE_FILE', __FILE__ );
define( 'BORDI_WIDGETS_CORE_DIR', plugin_dir_path( __FILE__ ) );
define( 'BORDI_WIDGETS_CORE_URL', plugin_dir_url( __FILE__ ) );

require_once BORDI_WIDGETS_CORE_DIR . 'includes/class-widget-registry.php';
require_once BORDI_WIDGETS_CORE_DIR . 'includes/class-rest-utilities.php';
require_once BORDI_WIDGETS_CORE_DIR . 'includes/class-enqueue.php';
require_once BORDI_WIDGETS_CORE_DIR . 'includes/class-admin.php';

/**
 * Boot the Core plugin. Widget plugins register themselves with the Registry on
 * their own `plugins_loaded` hook; Core's admin menu (an `admin_menu` hook) runs
 * later, so the registry is fully populated by then.
 */
function init() {
	Enqueue::instance()->register();
	Admin::instance()->register();
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\\init' );

/** Public accessor so widget plugins can confirm Core is present + compatible. */
function version() {
	return BORDI_WIDGETS_CORE_VERSION;
}
