<?php
/**
 * [roof_system] shortcode. Renders the <roof-system-widget> mount element with
 * the merged config (saved settings + per-instance attribute overrides) as JSON,
 * and enqueues the widget assets only when actually used.
 *
 * @package BordiWidgets\RoofSystem
 */

namespace BordiWidgets\RoofSystem;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Shortcode {

	/** @var Shortcode|null */
	private static $instance = null;

	private function __construct() {}

	public static function instance(): Shortcode {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function register(): void {
		add_shortcode( 'roof_system', array( $this, 'render' ) );
	}

	/**
	 * @param array|string $atts
	 */
	public function render( $atts ): string {
		$atts = shortcode_atts(
			array(
				// Content / layout / animation.
				'heading'             => '',
				'eyebrow'             => '',
				'subhead'             => '',
				'hold'                => '',
				'runway'              => '',
				'max_width'           => '',
				'frame_mode'          => '',
				// Theme colors (each maps to a --rsw-* CSS variable).
				'primary_color'       => '',
				'accent_color'        => '',
				'dot_color'           => '',
				'line_color'          => '',
				'bubble_bg_color'     => '',
				'bubble_border_color' => '',
				'bubble_text_color'   => '',
				'heading_color'       => '',
				'eyebrow_color'       => '',
				'subhead_color'       => '',
				'section_bg_color'    => '',
				// Typography.
				'font_family'         => '',
			),
			$atts,
			'roof_system'
		);

		Enqueue::ensure();

		$config = $this->build_config( $atts );

		if ( empty( $config ) ) {
			// No saved settings or overrides — let the widget use its JS defaults.
			return '<roof-system-widget></roof-system-widget>';
		}

		return sprintf(
			'<roof-system-widget data-config="%s"></roof-system-widget>',
			esc_attr( wp_json_encode( $config ) )
		);
	}

	/** Merge per-instance shortcode atts over the saved global config. */
	private function build_config( array $atts ): array {
		$config = Settings::instance()->get_config();

		$content = isset( $config['content'] ) && is_array( $config['content'] ) ? $config['content'] : array();
		if ( '' !== $atts['heading'] ) {
			$content['heading'] = array( 'text' => $atts['heading'] );
		}
		if ( '' !== $atts['eyebrow'] ) {
			$content['eyebrow'] = array(
				'text' => $atts['eyebrow'],
				'show' => true,
			);
		}
		if ( '' !== $atts['subhead'] ) {
			$content['subhead'] = array(
				'text' => $atts['subhead'],
				'show' => true,
			);
		}
		if ( ! empty( $content ) ) {
			$config['content'] = $content;
		}

		$animation = isset( $config['animation'] ) && is_array( $config['animation'] ) ? $config['animation'] : array();
		if ( '' !== $atts['hold'] ) {
			$animation['holdStart'] = (float) $atts['hold'];
		}
		if ( '' !== $atts['runway'] ) {
			$animation['runwayVh'] = (int) $atts['runway'];
		}
		if ( '' !== $atts['frame_mode'] ) {
			$animation['frameCountMode'] = sanitize_key( $atts['frame_mode'] );
		}
		if ( ! empty( $animation ) ) {
			$config['animation'] = $animation;
		}

		$layout = isset( $config['layout'] ) && is_array( $config['layout'] ) ? $config['layout'] : array();
		if ( '' !== $atts['max_width'] ) {
			$layout['maxWidth'] = (int) $atts['max_width'];
		}
		if ( ! empty( $layout ) ) {
			$config['layout'] = $layout;
		}

		// Theme colors — each sanitized to a safe CSS color before injection.
		$theme = isset( $config['theme'] ) && is_array( $config['theme'] ) ? $config['theme'] : array();

		$primary = self::sanitize_color( $atts['primary_color'] );
		if ( '' !== $primary ) {
			// "Primary" is the brand color — drives the numbered badges, the dots,
			// and the eyebrow. Granular color attrs below still override it.
			$theme['colorPrimary'] = $primary;
			$theme['colorDot']     = $primary;
			$theme['eyebrowColor'] = $primary;
		}

		$color_map = array(
			'accent_color'        => 'colorAccent',
			'dot_color'           => 'colorDot',
			'line_color'          => 'colorLine',
			'bubble_bg_color'     => 'bubbleBg',
			'bubble_border_color' => 'bubbleBorder',
			'bubble_text_color'   => 'bubbleText',
			'heading_color'       => 'headingColor',
			'eyebrow_color'       => 'eyebrowColor',
			'subhead_color'       => 'subheadColor',
			'section_bg_color'    => 'sectionBg',
		);
		foreach ( $color_map as $attr => $key ) {
			$color = self::sanitize_color( $atts[ $attr ] );
			if ( '' !== $color ) {
				$theme[ $key ] = $color;
			}
		}
		if ( ! empty( $theme ) ) {
			$config['theme'] = $theme;
		}

		// Typography.
		$typography = isset( $config['typography'] ) && is_array( $config['typography'] ) ? $config['typography'] : array();
		$font       = self::sanitize_font( $atts['font_family'] );
		if ( '' !== $font ) {
			$typography['fontFamily'] = $font;
		}
		if ( ! empty( $typography ) ) {
			$config['typography'] = $typography;
		}

		// Frames are plugin-bundled and NOT user-editable in v1, so force them to
		// known-good values. This also keeps the printf-style pattern ("%04d") and
		// the path away from the settings sanitizer entirely (sanitize_text_field
		// strips %-octets, which would mangle "frame_%04d" → "frame_d").
		$config['frames'] = array(
			'basePath'  => trailingslashit( plugins_url( 'assets/frames', RSW_FILE ) ),
			'fullCount' => 151,
			'pattern'   => 'frame_%04d',
		);

		return $config;
	}

	/**
	 * Allow only safe CSS color syntaxes: hex (#rgb/#rgba/#rrggbb/#rrggbbaa),
	 * rgb()/rgba()/hsl()/hsla(), or a bare keyword/named color. Anything that
	 * could break out of a CSS value (`;`, `{`, `url(`, etc.) returns ''.
	 */
	private static function sanitize_color( string $value ): string {
		$value = trim( $value );
		if ( '' === $value ) {
			return '';
		}
		if ( preg_match( '/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/', $value ) ) {
			return $value;
		}
		if ( preg_match( '/^(?:rgb|rgba|hsl|hsla)\(\s*[0-9.,%\s\/]+\)$/i', $value ) ) {
			return $value;
		}
		if ( preg_match( '/^[a-zA-Z]{1,40}$/', $value ) ) {
			return $value; // named color / keyword (e.g. transparent, currentColor)
		}
		return '';
	}

	/** Allow a conservative font-stack character set; otherwise return ''. */
	private static function sanitize_font( string $value ): string {
		$value = trim( $value );
		if ( '' === $value ) {
			return '';
		}
		return preg_match( '/^[a-zA-Z0-9 ,\'"._-]{1,200}$/', $value ) ? $value : '';
	}
}
