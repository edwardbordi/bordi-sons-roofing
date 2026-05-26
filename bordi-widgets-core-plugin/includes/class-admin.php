<?php
/**
 * Top-level "Bordi Widgets" admin menu + shell host. Each registered widget gets
 * a submenu page that mounts its own React admin panel (wired in a later phase).
 *
 * @package BordiWidgets\Core
 */

namespace BordiWidgets\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Admin {

	const MENU_SLUG = 'bordi-widgets';

	/** @var Admin|null */
	private static $instance = null;

	private function __construct() {}

	public static function instance(): Admin {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function register(): void {
		add_action( 'admin_menu', array( $this, 'menu' ) );
	}

	public function menu(): void {
		add_menu_page(
			__( 'Bordi Widgets', 'bordi-widgets-core' ),
			__( 'Bordi Widgets', 'bordi-widgets-core' ),
			'manage_options',
			self::MENU_SLUG,
			array( $this, 'render_overview' ),
			'dashicons-layout',
			58
		);

		foreach ( Registry::instance()->all() as $id => $widget ) {
			$render = isset( $widget['admin_render'] ) && is_callable( $widget['admin_render'] )
				? $widget['admin_render']
				: $this->default_renderer( $widget['title'] );

			add_submenu_page(
				self::MENU_SLUG,
				$widget['title'],
				$widget['title'],
				'manage_options',
				self::MENU_SLUG . '-' . $id,
				$render
			);
		}
	}

	/** Overview page listing installed widgets. */
	public function render_overview(): void {
		echo '<div class="wrap">';
		echo '<h1>' . esc_html__( 'Bordi Widgets', 'bordi-widgets-core' ) . '</h1>';
		$widgets = Registry::instance()->all();
		if ( empty( $widgets ) ) {
			echo '<p>' . esc_html__( 'No widgets installed yet. Activate a Bordi widget plugin to configure it here.', 'bordi-widgets-core' ) . '</p>';
		} else {
			echo '<p>' . esc_html__( 'Installed widgets:', 'bordi-widgets-core' ) . '</p><ul style="list-style:disc;padding-left:1.5em">';
			foreach ( $widgets as $widget ) {
				echo '<li>' . esc_html( $widget['title'] ) . '</li>';
			}
			echo '</ul>';
		}
		echo '</div>';
	}

	/** Fallback admin page for a widget that hasn't supplied its own renderer. */
	private function default_renderer( string $title ): callable {
		return static function () use ( $title ) {
			echo '<div class="wrap"><h1>' . esc_html( $title ) . '</h1>';
			echo '<p>' . esc_html__( 'This widget has not registered an admin panel.', 'bordi-widgets-core' ) . '</p></div>';
		};
	}
}
