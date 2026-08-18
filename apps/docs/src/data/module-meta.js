/**
 * Node-only barrel over the split module metadata. Build scripts and the
 * Playwright spec import this file; the browser bundle must use
 * module-index.js (eager shell data) or catalog.jsx's loadModuleRecord
 * (lazy per-module data) instead.
 */
import m_button from './modules/button.js'
import m_button_group from './modules/button-group.js'
import m_link from './modules/link.js'
import m_toggle from './modules/toggle.js'
import m_toolbar from './modules/toolbar.js'
import m_split_button from './modules/split-button.js'
import m_action_bar from './modules/action-bar.js'
import m_bulk_action_bar from './modules/bulk-action-bar.js'
import m_floating_action_button from './modules/floating-action-button.js'
import m_share_button from './modules/share-button.js'
import m_field from './modules/field.js'
import m_input from './modules/input.js'
import m_select from './modules/select.js'
import m_checkbox from './modules/checkbox.js'
import m_switch from './modules/switch.js'
import m_radio_group from './modules/radio-group.js'
import m_slider from './modules/slider.js'
import m_combobox from './modules/combobox.js'
import m_date_picker from './modules/date-picker.js'
import m_number_input from './modules/number-input.js'
import m_file_upload from './modules/file-upload.js'
import m_pin_input from './modules/pin-input.js'
import m_tags_input from './modules/tags-input.js'
import m_input_group from './modules/input-group.js'
import m_editable from './modules/editable.js'
import m_time_picker from './modules/time-picker.js'
import m_color_picker from './modules/color-picker.js'
import m_currency_input from './modules/currency-input.js'
import m_fieldset from './modules/fieldset.js'
import m_form from './modules/form.js'
import m_form_error_summary from './modules/form-error-summary.js'
import m_masked_input from './modules/masked-input.js'
import m_mention_input from './modules/mention-input.js'
import m_password_strength_meter from './modules/password-strength-meter.js'
import m_phone_input from './modules/phone-input.js'
import m_rich_text_editor from './modules/rich-text-editor.js'
import m_timezone_select from './modules/timezone-select.js'
import m_toggle_group from './modules/toggle-group.js'
import m_transfer_list from './modules/transfer-list.js'
import m_tree_select from './modules/tree-select.js'
import m_card from './modules/card.js'
import m_launcher_card from './modules/launcher-card.js'
import m_badge from './modules/badge.js'
import m_accordion from './modules/accordion.js'
import m_chip from './modules/chip.js'
import m_kbd from './modules/kbd.js'
import m_scroll_area from './modules/scroll-area.js'
import m_code_block from './modules/code-block.js'
import m_expandable_card from './modules/expandable-card.js'
import m_dialog from './modules/dialog.js'
import m_tooltip from './modules/tooltip.js'
import m_menu from './modules/menu.js'
import m_popover from './modules/popover.js'
import m_command from './modules/command.js'
import m_alert_dialog from './modules/alert-dialog.js'
import m_popconfirm from './modules/popconfirm.js'
import m_tour from './modules/tour.js'
import m_action_sheet from './modules/action-sheet.js'
import m_cookie_consent from './modules/cookie-consent.js'
import m_floating_panel from './modules/floating-panel.js'
import m_image_viewer from './modules/image-viewer.js'
import m_lightbox from './modules/lightbox.js'
import m_notification_center from './modules/notification-center.js'
import m_prompt_dialog from './modules/prompt-dialog.js'
import m_toast from './modules/toast.js'
import m_empty_state from './modules/empty-state.js'
import m_loading from './modules/loading.js'
import m_alert from './modules/alert.js'
import m_notification_item from './modules/notification-item.js'
import m_health_indicator from './modules/health-indicator.js'
import m_step_up_notice from './modules/step-up-notice.js'
import m_timeline from './modules/timeline.js'
import m_meter from './modules/meter.js'
import m_rating from './modules/rating.js'
import m_announcer from './modules/announcer.js'
import m_blocking_overlay from './modules/blocking-overlay.js'
import m_error_boundary from './modules/error-boundary.js'
import m_loading_bar from './modules/loading-bar.js'
import m_network_status from './modules/network-status.js'
import m_offline_banner from './modules/offline-banner.js'
import m_save_status from './modules/save-status.js'
import m_status_dot from './modules/status-dot.js'
import m_upload_progress from './modules/upload-progress.js'
import m_app_switcher from './modules/app-switcher.js'
import m_account_menu from './modules/account-menu.js'
import m_tabs from './modules/tabs.js'
import m_pagination from './modules/pagination.js'
import m_page_header from './modules/page-header.js'
import m_nav_rail from './modules/nav-rail.js'
import m_ecosystem_rail from './modules/ecosystem-rail.js'
import m_top_bar from './modules/top-bar.js'
import m_breadcrumb from './modules/breadcrumb.js'
import m_steps from './modules/steps.js'
import m_tree_view from './modules/tree-view.js'
import m_menubar from './modules/menubar.js'
import m_navigation_menu from './modules/navigation-menu.js'
import m_back_top from './modules/back-top.js'
import m_anchor_nav from './modules/anchor-nav.js'
import m_bottom_nav from './modules/bottom-nav.js'
import m_dock from './modules/dock.js'
import m_floating_toolbar from './modules/floating-toolbar.js'
import m_sidebar from './modules/sidebar.js'
import m_skip_link from './modules/skip-link.js'
import m_sub_nav from './modules/sub-nav.js'
import m_permission_matrix from './modules/permission-matrix.js'
import m_table from './modules/table.js'
import m_separator from './modules/separator.js'
import m_avatar from './modules/avatar.js'
import m_description_list from './modules/description-list.js'
import m_avatar_group from './modules/avatar-group.js'
import m_stat from './modules/stat.js'
import m_list from './modules/list.js'
import m_sparkline from './modules/sparkline.js'
import m_calendar from './modules/calendar.js'
import m_activity_feed from './modules/activity-feed.js'
import m_bar_chart from './modules/bar-chart.js'
import m_calendar_heatmap from './modules/calendar-heatmap.js'
import m_chart_container from './modules/chart-container.js'
import m_comment_thread from './modules/comment-thread.js'
import m_diff_viewer from './modules/diff-viewer.js'
import m_funnel_chart from './modules/funnel-chart.js'
import m_gantt_chart from './modules/gantt-chart.js'
import m_gauge_chart from './modules/gauge-chart.js'
import m_heatmap from './modules/heatmap.js'
import m_json_viewer from './modules/json-viewer.js'
import m_kanban_board from './modules/kanban-board.js'
import m_line_chart from './modules/line-chart.js'
import m_log_viewer from './modules/log-viewer.js'
import m_markdown_view from './modules/markdown-view.js'
import m_org_chart from './modules/org-chart.js'
import m_pie_chart from './modules/pie-chart.js'
import m_qr_code from './modules/qr-code.js'
import m_radar_chart from './modules/radar-chart.js'
import m_scatter_chart from './modules/scatter-chart.js'
import m_tree_grid from './modules/tree-grid.js'
import m_stack from './modules/stack.js'
import m_grid from './modules/grid.js'
import m_resizable from './modules/resizable.js'
import m_aspect_ratio from './modules/aspect-ratio.js'
import m_app_shell from './modules/app-shell.js'
import m_box from './modules/box.js'
import m_center from './modules/center.js'
import m_columns from './modules/columns.js'
import m_container from './modules/container.js'
import m_flex from './modules/flex.js'
import m_masonry from './modules/masonry.js'
import m_scroll_shadow from './modules/scroll-shadow.js'
import m_section from './modules/section.js'
import m_sticky_header from './modules/sticky-header.js'
import m_visually_hidden from './modules/visually-hidden.js'
import m_copy_button from './modules/copy-button.js'
import m_theme_toggle from './modules/theme-toggle.js'
import m_carousel from './modules/carousel.js'
import m_collapse from './modules/collapse.js'
import m_countdown_timer from './modules/countdown-timer.js'
import m_focus_trap from './modules/focus-trap.js'
import m_highlight_text from './modules/highlight-text.js'
import m_infinite_scroll from './modules/infinite-scroll.js'
import m_lazy_image from './modules/lazy-image.js'
import m_marquee from './modules/marquee.js'
import m_number_ticker from './modules/number-ticker.js'
import m_portal from './modules/portal.js'
import m_presence from './modules/presence.js'
import m_reveal from './modules/reveal.js'
import m_time_ago from './modules/time-ago.js'
import m_truncated_text from './modules/truncated-text.js'
import m_virtual_list from './modules/virtual-list.js'

export const moduleGroups = [
	{
		name: "Actions",
		modules: [m_button, m_button_group, m_link, m_toggle, m_toolbar, m_split_button, m_action_bar, m_bulk_action_bar, m_floating_action_button, m_share_button],
	},
	{
		name: "Forms",
		modules: [m_field, m_input, m_select, m_checkbox, m_switch, m_radio_group, m_slider, m_combobox, m_date_picker, m_number_input, m_file_upload, m_pin_input, m_tags_input, m_input_group, m_editable, m_time_picker, m_color_picker, m_currency_input, m_fieldset, m_form, m_form_error_summary, m_masked_input, m_mention_input, m_password_strength_meter, m_phone_input, m_rich_text_editor, m_timezone_select, m_toggle_group, m_transfer_list, m_tree_select],
	},
	{
		name: "Surfaces",
		modules: [m_card, m_launcher_card, m_badge, m_accordion, m_chip, m_kbd, m_scroll_area, m_code_block, m_expandable_card],
	},
	{
		name: "Overlays",
		modules: [m_dialog, m_tooltip, m_menu, m_popover, m_command, m_alert_dialog, m_popconfirm, m_tour, m_action_sheet, m_cookie_consent, m_floating_panel, m_image_viewer, m_lightbox, m_notification_center, m_prompt_dialog],
	},
	{
		name: "Feedback",
		modules: [m_toast, m_empty_state, m_loading, m_alert, m_notification_item, m_health_indicator, m_step_up_notice, m_timeline, m_meter, m_rating, m_announcer, m_blocking_overlay, m_error_boundary, m_loading_bar, m_network_status, m_offline_banner, m_save_status, m_status_dot, m_upload_progress],
	},
	{
		name: "Navigation",
		modules: [m_app_switcher, m_account_menu, m_tabs, m_pagination, m_page_header, m_nav_rail, m_ecosystem_rail, m_top_bar, m_breadcrumb, m_steps, m_tree_view, m_menubar, m_navigation_menu, m_back_top, m_anchor_nav, m_bottom_nav, m_dock, m_floating_toolbar, m_sidebar, m_skip_link, m_sub_nav],
	},
	{
		name: "Data",
		modules: [m_permission_matrix, m_table, m_separator, m_avatar, m_description_list, m_avatar_group, m_stat, m_list, m_sparkline, m_calendar, m_activity_feed, m_bar_chart, m_calendar_heatmap, m_chart_container, m_comment_thread, m_diff_viewer, m_funnel_chart, m_gantt_chart, m_gauge_chart, m_heatmap, m_json_viewer, m_kanban_board, m_line_chart, m_log_viewer, m_markdown_view, m_org_chart, m_pie_chart, m_qr_code, m_radar_chart, m_scatter_chart, m_tree_grid],
	},
	{
		name: "Layout",
		modules: [m_stack, m_grid, m_resizable, m_aspect_ratio, m_app_shell, m_box, m_center, m_columns, m_container, m_flex, m_masonry, m_scroll_shadow, m_section, m_sticky_header],
	},
	{
		name: "Utilities",
		modules: [m_visually_hidden, m_copy_button, m_theme_toggle, m_carousel, m_collapse, m_countdown_timer, m_focus_trap, m_highlight_text, m_infinite_scroll, m_lazy_image, m_marquee, m_number_ticker, m_portal, m_presence, m_reveal, m_time_ago, m_truncated_text, m_virtual_list],
	},
]

export const modules = moduleGroups.flatMap((group) => group.modules)
export const moduleGuidance = Object.fromEntries(modules.map((module) => [module.id, module.guidance]))
