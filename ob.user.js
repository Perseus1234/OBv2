// ==UserScript==
// @name                Omerta Beyond
// @id                  Omerta Beyond
// @version             2.0
// @date                18-02-2013
// @description         Omerta Beyond 2.0 (We're back to reclaim the throne ;))
// @homepageURL         http://www.omertabeyond.com/
// @namespace           v4.omertabeyond.com
// @updateURL           https://raw.github.com/OmertaBeyond/OBv2/master/beyond.meta.js
// @supportURL          https://github.com/OmertaBeyond/OBv2/issues
// @icon                https://raw.github.com/OmertaBeyond/OBv2/master/images/logo.small.png
// @screenshot          https://raw.github.com/OmertaBeyond/OBv2/master/images/logo.small.png
// @author              OBDev Team <info@omertabeyond.com>
// @author              vBm <vbm@omertabeyond.com>
// @author              Dopedog <dopedog@omertabeyond.com>
// @author              Rix <rix@omertabeyond.com>
// @author              MrWhite <mrwhite@omertabeyond.com>
// @license             GNU General Public License v3
// @contributionURL     https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=sbanks%40omertabeyond%2ecom&lc=GB&item_name=Omerta%20Beyond&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted
// @contributionAmount  €3.00
// @encoding            UTF-8
// @priority            1
// @require             https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @resource    favicon https://raw.github.com/OmertaBeyond/OBv2/master/images/favicon.png
// @resource    logo    https://raw.github.com/OmertaBeyond/OBv2/master/images/logo.png
// @resource    prev	https://raw.github.com/OmertaBeyond/OBv2/master/images/prev.png
// @resource    next    https://raw.github.com/OmertaBeyond/OBv2/master/images/next.png
// @resource    reply   https://raw.github.com/OmertaBeyond/OBv2/master/images/reply.png
// @resource    delete  https://raw.github.com/OmertaBeyond/OBv2/master/images/delete.png
// @include             http://*.omerta3.com/*
// @include             http://omerta3.com/*
// @include             http://*.barafranca.com/*
// @include             http://barafranca.com/*
// @include             http://*.barafranca.us/*
// @include             http://barafranca.us/*
// ==/UserScript==

// Prevent Omerta's jQuery to conflict with our
this.$ = this.jQuery = jQuery.noConflict(true);

// some global defines

const OB_WEBSITE = 'http://www.omertabeyond.com';
const OB_API_WEBSITE = 'http://gm.omertabeyond.com';
const OB_NEWS_WEBSITE = 'http://news.omertabeyond.com';
const OB_STATS_WEBSITE = 'http://stats.omertabeyond.com';
const v = 'com';

function on_page(str) {
	if (window.location.hash.indexOf(str) != -1) {
		return true;
	} else {
		return false;
	}
}
function getV(name, standard) {
    return localStorage[name+'_'+v] || standard;
}
function setV(name, value) {
    return localStorage[name+'_'+v] = value;
}
function time() {
	return Math.floor(parseInt(new Date().getTime(), 10) / 1000);
}


if (document.getElementById('game_container') !== null) {
	document.getElementById('game_container').addEventListener('DOMNodeInserted', function(event) {
		if (event.target.nodeType != 1) {
			return false;
		}
		if ($(event.target).attr('data-beyond-fired') !== undefined) {
			return false;
		}

		$(event.target).attr('data-beyond-fired', 'true');

		var wlh = window.location.hash;
		var nn  = event.target.tagName.toLowerCase();

		if (on_page('/family.php') && nn == 'center') {

			// add HR, Deaths and Worth
			var famid = wlh.split('=')[1];
			var famIdFromImg = $('img[src*="family_image.php"]').attr('src').match(/\d+/g)[0];
			var famname = $('td.profilerow').text().split(' ')[0].trim().toLowerCase();
			var url = (famid === famIdFromImg) ? 'id='+famid : 'ing='+famname;

			$.getJSON(OB_API_WEBSITE + '/?p=stats&w=fampage&v=com&' + url, function(data) {

				/*
				 * Family position and worth
				 */
				$('td.subtableheader').first().closest('tr').after(
					$('<tr>').append(
						$('<td>').addClass('subtableheader').text('Position:'),
						$('<td>').addClass('profilerow').text('#'+data['pos']+' - Worth: '+data['worth']+'')
					)
				);

				// add HR
				$('table.thinline').first().find('tbody').append(
					$('<tr>').append(
						$('<td>').addClass('subtableheader').text('Ranks:'),
						$('<td>').addClass('profilerow').append(
							$('<table>').attr('width', '100%').append(
								$('<tr>').append($('<td>').text('Godfather/First Lady:'), $('<td>').addClass('bold').text(data['hr']['gf'])),
								$('<tr>').append($('<td>').text('Capodecina:'), $('<td>').addClass('bold').text(data['hr']['cd'])),
								$('<tr>').append($('<td>').text('Bruglione:'), $('<td>').addClass('bold').text(data['hr']['brug'])),
								$('<tr>').append($('<td>').text('Chief:'), $('<td>').addClass('bold').text(data['hr']['chief'])),
								$('<tr>').append($('<td>').text('Local Chief:'), $('<td>').addClass('bold').text(data['hr']['lc'])),
								$('<tr>').append($('<td>').text('Assassin:'), $('<td>').addClass('bold').text(data['hr']['assa'])),
								$('<tr>').append($('<td>').text('Swindler:'), $('<td>').addClass('bold').text(data['hr']['swin'])),
								$('<tr>').append($('<td>').attr('colspan', '2').append($('<hr />'))),
								$('<tr>').append($('<td>').text('Total points:'), $('<td>').addClass('bold').text(data['hr']['pts']))
							)
						)
					)
				);

				/*
				 * Family deaths
				 */
				$('table.thinline:eq(1)').closest('td').append(
					$('<br />'),
					$('<table>').addClass('thinline').css('width', '100%').attr('cellspacing', '0').attr('cellpadding', '2').attr('rules', 'none').append(
						$('<tr>').append(
							$('<td>').addClass('tableheader').attr('colspan', '100%').text('Last family deaths').append(
								$('<div>').css({'float': 'right', 'margin-right': '5px', 'margin-top': '3px'}).append(
									$('<a>').attr('href', OB_NEWS_WEBSITE + '/deathslog/' + famid).attr('target', '_blank').append(
										$('<img>').addClass('brcImg').attr('title', 'View full deathslog')
									)
								)
							)
						),
						$('<tr>').append(
							$('<td>').attr('colspan', '100%').attr('bgcolor', 'black').attr('height', '1')
						),
						$('<tr>').append(
							$('<td>').addClass('bold').css('width', '28%').attr('align', 'left').text('Name'),
							$('<td>').addClass('bold').attr('align', 'center').text('Rank'),
							$('<td>').addClass('bold').attr('align', 'center').text('Date'),
							$('<td>').addClass('bold').css('text-align', 'right').text('Ago')
						)
					)
				);

				var deaths_body = $('table.thinline:eq(2)').find('tbody');
				if (data['deaths']) {
					$.each(data['deaths'], function(k, v) {
						var extra = (v['Akill'] == 1)?'(<b>A</b>) ':(v['BF'] == 1)?'(<b>BF</b>) ':'';

						deaths_body.append(
							$('<tr>').append(
								$('<td>').text(extra).append(
									$('<a>').attr('href', 'user.php?name=' + v['Name']).text(v['Name'])
								),
								$('<td>').attr('align', 'center').append(
									$('<a>').attr('href', OB_STATS_WEBSITE + '/history.php?v=com&name=' + v['Name']).text(v['Rank'])
								),
								$('<td>').attr('align', 'center').text(v['Date']),
								$('<td>').css('text-align', 'right').text(v['Agod'] + 'd ' + v['Agoh'] + 'h ' + v['Agom'] + 'm')
							)
						);
					});
				} else {
					deaths_body.append(
						$('<tr>').append(
							$('<td>').addClass('red').css('text-align', 'center').attr('colspan', '4').text('There are no deaths yet!')
						)
					);
				}


				// add Famlog
				$('table.thinline:eq(1)').closest('td').append(
					$('<br />'),
					$('<table>').addClass('thinline').css('width', '100%').attr('cellspacing', '0').attr('cellpadding', '2').attr('rules', 'none').append(
						$('<tr>').append(
							$('<td>').addClass('tableheader').attr('colspan', '100%').text('Last family changes').append(
								$('<div>').css({'float': 'right', 'margin-right': '5px', 'margin-top': '3px'}).append(
									$('<a>').attr('href', OB_NEWS_WEBSITE + '/famlog/' + famid).attr('target', '_blank').append(
										$('<img>').addClass('brcImg').attr('title', 'View full changelog')
									)
								)
							)
						),
						$('<tr>').append(
							$('<td>').attr('colspan', '100%').attr('bgcolor', 'black').attr('height', '1')
						),
						$('<tr>').append(
							$('<td>').addClass('bold').css('width', '28%').attr('align', 'left').text('Date'),
							$('<td>').addClass('bold').attr('align', 'left').text('Change')
						)
					)
				);

				var changes_body = $('table.thinline:eq(3)').find('tbody');
				if (data['changes']) {
					$.each(data['changes'], function(k, v) {
						changes_body.append(
							$('<tr>').append(
								$('<td>').css('width', '28%').attr('align', 'left').attr('valign', 'top').text(v['date']),
								$('<td>').attr('align', 'left').text(v['text'])
							)
						);
					});
				} else {
					changes_body.append(
						$('<tr>').append(
							$('<td>').addClass('red').css('text-align', 'center').attr('colspan', '2').text('There are no changes yet!')
						)
					);
				}
			});
		}
		// 1 click voter
		if (on_page('/vfo.php') && nn == 'center') {
			$('a[href*="votelot.php"]').attr('name', 'forticket');
			function voteNow(save) {
				$('a[name="forticket"]').each(function() {
					window.open(this);
				});
				if (save) {//store last voting time
					setV('lastvote', time());
				}
			}
			$('td[class="tableheader"]:first').html(
				$('<span>').addClass('orange').css({'cursor': 'pointer', 'color': 'orange'}).attr({'id': 'votelink', 'title': ''}).text($('td[class="tableheader"]:first').text())
			).click(function () {
					voteNow(false);
			});
			var lastVote = getV('lastvote', 0); //get last voting time
			if (lastVote == 0) {
				if (confirm('You haven\'t used the 1-click voter yet!\nDo you want to use it now?')) {
					voteNow(true);
				}
			} else { //not first run
				var till = (parseInt(lastVote, 10) + 86400) - time(); // time till next vote
				var msg = '';
				if (till <= 0) { // user can vote again so ask
					var ago = time() - lastVote; // time since last vote
					msg += 'You haven\'t used the 1-click voter today!' + '\n' + 'Since you last used the 1-click voter, it\'s been:';
					msg += Math.floor(ago / 86400) + ' days, '; // days
					msg += Math.floor((ago % 86400) / 3600) + ' hours, '; // hours
					msg += Math.floor((ago % 3600) / 60) + ' minutes and '; // minutes
					msg += Math.floor(ago % 60) + ' seconds.'; // seconds
					msg += '\n' + 'Do you want to use the 1-click voter now?';
				} else { // can't vote yet
					msg += 'You can\'t vote again yet!\nPlease wait another:\n';
					msg += Math.floor(till / 3600) + ' hours, '; // hours
					msg += Math.floor((till % 3600) / 60) + ' minutes and '; // minutes
					msg += Math.floor(till % 60) + ' seconds.'; // seconds
					msg += '\n' + 'Do you still want to vote?';
				}
				if (confirm(msg)) {
					voteNow(true);
				}
			}
		}
		// GroupCrime accept focus
		if (on_page('module=GroupCrimes') && nn == 'center') {
			$('a').filter(function(){
				return (/Accept/i).test($(this).text())
			}).focus();
		}
		//Heist Autoform
		if (on_page('module=Heist') && nn == 'center') {
			$('input[name="bullets"]').val('50');
			$('select[name="gun"]').val('real');
			$('input[name="driver"]').focus();
		}
		//Inbox
		//Show message
		if (on_page('action=showMsg') && nn == 'center') {
			var id = wlh.split('iMsgId=')[1].match(/\d+/g)[0];
			var ids = getV('msgids', '').split(',');
			for(i = 0;i<ids.length;i++){
				if (ids[i] == id) {
					var nonext = (i==0)?'visibility:hidden; ':'';
					var noprev = (i==ids.length-1)?'visibility:hidden; ':'';
					var next = ids[i-1];
					var prev = ids[i+1];
				}
			}
			//check unread msg and grab obay bullets
			var unread = getV('unread', '').split(',');
			for (var x = 0; x < unread.length; ++x) {
				if (unread[x] != '' && unread[x] == id) { //msg is unread
					var msgTyp = $('tr.tableitem').text().split('Type:')[1].split('Sent:')[0];
					var arr = $('table.thinline > tbody > tr:eq(7) > td').html().split(' ');
					var bulletmsg = new RegExp('Obay bid succesful');
					if (bulletmsg.test(msgTyp)) { //grab obay bullets from message
						setV('obaybul', (getV('obaybul', 0) + parseInt(arr[2], 10)));
					}
					// resave unread msg's, without our msg
					var str = '';
					for (var y = 0; y < unread.length; ++y) {
						if (unread[y] != '' && unread[y] != id) {
							str += ','+unread[y];
						}
					}
					setV('unread', str.substr(1));
					x = unread.length; // not needed to continue because we found our id
				}
			}
			//add previous and next arrows
			setTimeout(function () {
				$('table.thinline > tbody > tr > td.tableheader:eq(1)').append(
					$('<span>').css({'float': 'right', 'padding-top': '2px'}).append(
						$('<img>').attr({title: 'Previous', class: 'inboxImg', src: GM_getResourceURL('prev')}) //.css(noprev)					
					).append(
						$('<img>').attr({title: 'Next', class: 'inboxImg', src: GM_getResourceURL('next')}) //.css(nonext)					
					)
				);
			}, 0);
			//remove target from family invite
			if ($('a[contains(@href,"/family.php?join=yes")]').length>0) {
				$('a[contains(@href,"/family.php?join=yes")]').removeAttr('target');
			}
			//replace reply and delete links
			var linkz = $('table.thinline > tbody > tr:eq(9) > td > a');
			if (linkz.length == 1) {
				setTimeout(function () {
					$('table.thinline > tbody > tr:eq(9) > td > a').html(
						$('<img />').attr({src: GM_getResourceURL('delete'), title: 'Delete ([)', class: 'inboxImg'})
					).attr('accesskey', '[');
				}, 0);
			} else {
				setTimeout(function () {
					$('table.thinline > tbody > tr:eq(9) > td > a:first').html(
						$('<img />').attr({src: GM_getResourceURL('delete'), title: 'Delete ([)', class: 'inboxImg'})
					).attr('accesskey', '[');
					$('table.thinline > tbody > tr:eq(9) > td > a:last').html(
						$('<img />').attr({src: GM_getResourceURL('reply'), title: 'Reply (])', class: 'inboxImg'})
					).attr('accesskey', ']');
				}, 0);
			}
		}
		//focus on text area
		if (on_page('iReply=') && nn == 'center') {
			$('textarea').focus();
		}
		//redirect on send message
		if (on_page('action=sendMsg') && nn == 'b') {//needs testing
			if ($('font:eq(0)').text().indexOf('Message sent to') != -1) {
				setTimeout(function () {
					$('a')[0].click();
				}, 1000);
			}
		}
	}, true);
}

$('input[name="email"]').focus();

// Replace Omerta's favicon
$('<link rel="shortcut icon" type="image/x-icon"/>').appendTo('head').attr('href', GM_getResourceURL('favicon'));

// Replace Omerta's logo
$('#game_header_left').children('img').attr('src', GM_getResourceURL('logo'));
