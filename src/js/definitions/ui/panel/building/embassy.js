/**
 * Embassy panel data.
 *
 * @type {Object}
 */
civitas.PANEL_EMBASSY = {
	template: civitas.ui.building_panel_template(),
	id: 'embassy',
	on_show: function(params) {
		let self = this;
		let core = this.core();
		let settlement = core.get_settlement();
		let settlements = core.get_settlements();
		let status = settlement.status();
		let building = core.get_settlement().get_building(this.params_data.handle);
		let level = building.get_level();
		$(this.handle + ' section').append(civitas.ui.tabs([
			'Info',
			'Diplomacy',
			'Espionage'
		]));
		$(this.handle + ' #tab-diplomacy').empty().append('<div class="settlements-list"></div>');
		$(this.handle).on('click', '.view', function () {
			let _settlement_id = parseInt($(this).data('id'));
			let _settlement = core.get_settlement(_settlement_id);
			if (_settlement) {
				core.open_panel(civitas.PANEL_SETTLEMENT, _settlement);
			}
			return false;
		});
	},
	on_refresh: function() {
		let core = this.core();
		let settlement = core.get_settlement();
		let settlements = core.get_settlements();
		let status = settlement.status();
		let building = core.get_settlement().get_building(this.params_data.handle);
		if (building) {
			let level = building.get_level();
			$(this.handle + ' #tab-info').empty().append(civitas.ui.building_panel(this.params_data, level));
			$(this.handle + ' #tab-espionage').empty().append('<div class="section">' + civitas.ui.progress((settlement.espionage() * 100) / civitas.MAX_ESPIONAGE_VALUE, 'large', settlement.espionage()) + '</div>');
			let _t = '<table class="normal">';
			for (let i = 1; i < settlements.length; i++) {
				let _status = settlement.get_diplomacy_status(settlements[i].id());
				_t += '<tr>' +
						'<td class="icon">' +
							'<a data-id="' + settlements[i].id() + '" title="View info about this settlement." class="tips view" href="#"><img src="' + civitas.ASSETS_URL + 'images/assets/avatars/avatar' + settlements[i].ruler().avatar + '.png" /></a>' +
						'</td>' +
						'<td>' +
							'<p class="title">' + settlements[i].nice_name() + '</p> ' +
							'<div data-id="' + settlements[i].id() + '" >' + civitas.ui.progress(status[settlements[i].id()].influence, 'big') + '</div>' +
						'</td>' +
						'<td>' +
							'<p>Leader: <strong>' + settlements[i].ruler().name + '</strong>' + '</p>' +
							'<p>Personality: <strong>' + settlements[i].personality().name + '</strong>' + '</p>' +
							'<p>Diplomatic Status: <strong>' + settlement.get_diplomacy_status(settlements[i].id()).name + '</strong>' + '</p>' +
						'</td>' +
					'</tr>';
			}
			_t += '</table>';
			$(this.handle + ' .settlements-list').empty().append(_t);
		} else {
			this.destroy();
		}
	}
};
