var userOptions = {
    filters: []
}
var properties = {};
var map;

// 2018 income limits effective June 1st
var incomeLimits = {
    1: {
        12050: 20,
        18100: 30,
        24100: 40,
        30100: 50,
        36120: 60,
        39150: 65,
        42150: 70,
        48200: 80,
        60200: 100,
        72250: 120,
        84300: 140
    },
    2: {
        13750: 20,
        20650: 30,
        27500: 40,
        34400: 50,
        41280: 60,
        44700: 65,
        48150: 70,
        55050: 80,
        68800: 100,
        82550: 120,
        96300: 140
    },
    3: {
        15500: 20,
        23250: 30,
        30950: 40,
        38700: 50,
        46440 : 60,
        50300 : 65,
        54200: 70,
        61950 : 80,
        77400: 100,
        92900: 120,
        108350: 140
    },
    4: {
        17200: 20,
        25800 : 30,
        34400: 40,
        43000: 50,
        51600 : 60,
        55900 : 65,
        60200: 70,
        68800 : 80,
        86000: 100,
        103200: 120,
        120400: 140
    },
    5: {
        18600 : 20,
        27900 : 30,
        37150: 40,
        46450: 50,
        55740 : 60,
        60350  : 65,
        65000: 70,
        74350 : 80,
        92900: 100,
        111450 : 120,
        130050: 140
    },
    6: {
        19950 : 20,
        29950 : 30,
        39900: 40,
        49900: 50,
        59880 : 60,
        64850  : 65,
        69850: 70,
        79850 : 80,
        99750: 100,
        119700 : 120,
        139650: 140
    },
    7: {
        21350 : 20,
        32000 : 30,
        42650: 40,
        53350: 50,
        64020 : 60,
        69300  : 65,
        74650: 70,
        85350 : 80,
        106650: 100,
        127950 : 120,
        149300 : 140
    },
    8: {
        22700 : 20,
        34100 : 30,
        45400: 40,
        56800: 50,
        68160 : 60,
        73800  : 65,
        79450: 70,
        90850 : 80,
        113500: 100,
        136200 : 120,
        158950 : 140
    }
}

function getMFILevel(yearlyIncome, householdSize) {
    let size = householdSize;
    if (householdSize > 8) {
        size = 8;
    }

    let householdIncomeLimits = incomeLimits[size];
    let income = 0;

   let incomes = _.keys(householdIncomeLimits);
   incomes.sort(function(a, b) {return a - b});

   console.log(incomes);

   for (var thisIncome of incomes) {
        if (yearlyIncome < parseInt(thisIncome)) {
            income = thisIncome;
            break;
        }
   }

   let mfi = incomeLimits[size][thisIncome];
   console.log(mfi);
   return mfi;
}

$(document).ready(function() {
    getAllProperties();

    var optionsWizardNum = 1;

    $('.next-btn').click(function() {
        $('#options-wizard-' + optionsWizardNum).hide();
        optionsWizardNum = optionsWizardNum + 1;

        // skip schools for now
        if (optionsWizardNum == 7) {
            optionsWizardNum = optionsWizardNum + 1;
        }
        $('#options-wizard-' + optionsWizardNum).show();

        if (optionsWizardNum > 1) {
            $('.back-btn').show();
        }

        if (optionsWizardNum == 10) {
            $('.next-btn').hide();
            $('.done-btn').show();
        }
    });

    $('.back-btn').click(function() {
        $('#options-wizard-' + optionsWizardNum).hide();
        optionsWizardNum = optionsWizardNum - 1;

        // skip schools for now
        if (optionsWizardNum == 7) {
            optionsWizardNum = optionsWizardNum - 1;
        }
        $('#options-wizard-' + optionsWizardNum).show();

        if (optionsWizardNum < 2) {
            $('.back-btn').hide();
        }

        if (optionsWizardNum != 10) {
            $('.next-btn').show();
            $('.done-btn').hide();
        }
    });

    $('.done-btn').click(function() {
        $('#options-wizard-' + optionsWizardNum).hide();
        optionsWizardNum = 1;

        // hide welcome container
        $('#welcome-container').animate({height: '0%'}, 'slow', function() {
            $('.top-header').show();
            $('.top-header').css('height', '0px');
            $('.top-header').animate({height: '60px'}, 'slow');
            $('#welcome-container').hide();
        });

        renderMarkers2(map);

        // show side tabs
        $('#filter-applied-banner').show();
        $('#map-legend-banner').show();
        $('#filter-applied-banner').css('width', '30px');
        $('#map-legend-banner').css('width', '30px');
    });

    // init map
    map = initMap();
    var titleLayer = initTitleLayer();
    L.control.zoom({
        position: "bottomright"
    }).addTo(map);

    titleLayer.addTo(map);

    $('#map-legend-banner').click(function() {
            $('#filter-applied-banner').animate({width: '0px'}, 'slow');
            $('#map-legend-banner').animate({width: '0px'}, 'slow');
            $('#legend-container').show();
            $('#legend-container').animate({height: '80%'}, 'slow');
    });

    $('#cancel-map-legend').click(function() {
        $('#legend-container').animate({height: '0%'}, 'slow', function(){$('#legend-container').hide();});
        $('#filter-applied-banner').animate({width: '30px'}, 'slow');
        $('#map-legend-banner').animate({width: '30px'}, 'slow');
    });

    $('#filter-applied-banner').click(function() {
        $('#filter-applied-banner').animate({width: '0%'}, 'slow');
        $('#map-legend-banner').animate({width: '0%'}, 'slow');
        $('#filter-applied-banner').hide();
        $('#map-legend-banner').hide();
        $('.top-header').hide();

        $('#welcome-container').show();
        $('#welcome-container').css('height', '0%');
        $('#welcome-container').animate({'height': '100%'}, 'slow');

        $('#options-wizard-' + 3).show();
        $('.done-btn').show();
        $('.back-btn').hide();
        // $('.next-btn').show();
    });

    $('.select-lang').click(function(e) {
        userOptions['lang'] = $(e.target).text();
        $('.select-lang').removeClass('btn-select');
        $(e.target).addClass('btn-select');
        console.log(userOptions);
    });

    $('.select-voucher').click(function(e) {
        userOptions['section8'] = $(e.target).text();
        $('.select-voucher').removeClass('btn-select');
        $(e.target).addClass('btn-select');
        console.log(userOptions);
    });

    $('.select-public-transport').click(function(e) {
        $('.select-public-transport').removeClass('btn-select');
        $(e.target).addClass('btn-select');
    });

    $('.select-grocery').click(function(e) {
        $('.select-grocery').removeClass('btn-select');
        $(e.target).addClass('btn-select');
    });

    $('#yearly-income-input').blur(function(e) {
        userOptions['income'] = $(e.target).val();
        console.log(userOptions);
    });

    $('#household-size').blur(function(e) {
        userOptions['household-size'] = $(e.target).val();
        console.log(userOptions);
    });

    $('.options-big-btn').click(function(e) {
        if ($(e.target).data('field')) {
            var fieldVal = $(e.target).data('field');
            console.log($(e.target).data('field'));
            if (!_.contains(userOptions.filters, fieldVal)) {
                userOptions.filters.push(fieldVal);
            } else {
                userOptions.filters = userOptions.filters.filter(function(x) {return x != fieldVal});
            }
            console.log(userOptions);
        }

        if ($(e.target).hasClass('btn-select')) {
            $(e.target).removeClass('btn-select');
        } else {
            $(e.target).addClass('btn-select');
        }
    });

    // prevent zooming on mobile
    $('.options-wizard-plus-minus-btn').bind('touchend', function(e) {
        e.preventDefault();
        $(this).click();
    });

    // prevent zooming on mobile
    $('.options-big-btn').bind('touchend', function(e) {
        e.preventDefault();
        $(this).click();
    });

    // prevent zooming on mobile
    $('.next-btn').bind('touchend', function(e) {
        e.preventDefault();
        $(this).click();
    });

    // prevent zooming on mobile
    $('.back-btn').bind('touchend', function(e) {
        e.preventDefault();
        $(this).click();
    });

    $('.options-wizard-plus-minus-btn').click(function(e) {
        var operation = $(e.target).text();
        var elem = $(e.target).closest('.justify-center').find('.options-wizard-plus-minus-val');
        var val = parseInt(elem.text());
        if (operation == '-') {
            if (val > 0) {
                val = val - 1;
            }
        } else {
            val = val + 1;
        }
        $(elem).text(val);
    });
});

// score indicates degree to which property is a match, acceptence critieria (i.e. broken lease, etc.) and section 8 are prioritized in terms of weights
function addMatchScore(property) {
    var matchScore = 0;

    for (var f of userOptions.filters) {
        if (_.contains(['broken_lease', 'eviction_history', 'criminal_history'], f)) {
            if (property[f] == 'yes') {
                matchScore = matchScore + 10;
            } else if (property[f] == 'depends') {
                matchScore = matchScore + 5;
            }
        } else {
            if (property[f] == 1) {
                matchScore = matchScore + 10;
            }
        }
    }

    if (userOptions.section8 == 'YES') {
        if (property['accepts_section_8'] == 1) {
            matchScore = matchScore + 25;
        }
    }

    property.data__matchScore = matchScore;

    return property;
}

function getAllProperties() {
    $.get(
        data_hub_api_endpoint,
        function(response) {
            console.log(response);
            // var propertiesTemp = response.data;
            var propertiesTemp = response;

            for (var property of propertiesTemp) {
                console.log(property);
                if (property.data__lat && property.data__longitude) {
                    properties[property.data__id] = property;
                }
            }
        }
    )
}

function renderMarkers2(map) {

    let size = userOptions['household-size'];
    let mfiLevel = getMFILevel(userOptions.income, size);

    let allMfiLevels = [20, 30, 40, 50, 60, 65, 70, 80, 100, 120, 140];


    let tempMFILevel = mfiLevel;
    let mfiPropertyMatches = [];
    let doneMatching = false;

    while(mfiPropertyMatches.length < 5 && !doneMatching) {
        console.log('in while loop');
        for (var pr in properties) {
            var property = properties[pr];
            var x = 'data__num_units_mfi_' + tempMFILevel;
            if (parseInt(property[x]) > 0) {
                mfiPropertyMatches.push(property.data__id);
            }
            if (mfiPropertyMatches.length >= 5) {
                doneMatching = true;
                break;
            }
        }

        let mfiLevelIndex = allMfiLevels.findIndex(function(mfi) {
            return mfi == tempMFILevel;
        });

        var tempMFILevelIndex = mfiLevelIndex + 1;

        if (tempMFILevelIndex > (allMfiLevels.length - 1)) {
            doneMatching = true;
        } else {
            tempMFILevel = allMfiLevels[tempMFILevelIndex];
        }
    }

    console.log('anything?');
    console.log(mfiPropertyMatches);




    var markers = new L.FeatureGroup();

    for (var p in properties) {
        var property = properties[p];
        // property = addMatchScore(property);
        properties[property.data__id] = property;
    }

    // sort desc by matchScore
    var propertiesList = _.sortBy(properties, 'data__id');
    // var propertiesList = _.sortBy(properties, 'matchScore');
    // propertiesList = propertiesList.reverse();

    var numAvailableAffordableUnits = 0;
    var numSection8Units = 0;


    // TODO: need to set validation to make sure they enter this, need to add logic below to somehow filter or indicate matching indicators
    // let mfi = getMFILevel(userOptions['income'], userOptions['household-size']);

    // first 10 'highest' matches are marked as recommended
    // var first10 = 0;
    for (var property of propertiesList) {
        // first10 = first10 + 1;
        // if (first10 <= 10 && property.data__matchScore > 0 && property.data__has_available_affordable_units) {
        //     var marker = L.marker([parseFloat(property.data__lat), parseFloat(property.data__longitude)], {icon: assignMarker("orange", "star")});
        //     properties[property.data__id].color = 'orange';
        // } else if (first10 <= 10 && property.data__matchScore > 0) {
        //     var marker = L.marker([parseFloat(property.data__lat), parseFloat(property.data__longitude)], {icon: assignMarker("green")});
        //     properties[property.data__id].color = 'green';
        // } else {

            if (_.contains(mfiPropertyMatches, property.data__id)) {
                var marker = L.marker([parseFloat(property.data__lat), parseFloat(property.data__longitude)], {icon: assignMarker("green")});
                properties[property.data__id].color = 'green';
            } else {
                var marker = L.marker([parseFloat(property.data__lat), parseFloat(property.data__longitude)], {icon: assignMarker("blue")});
                properties[property.data__id].color = 'blue';
            }

        // }

        marker.markerID = property.data__id;
        marker.on("click", markerOnClick)
        markers.addLayer(marker);

        if (property.data__has_available_affordable_units) {
            console.log('property has available properties');
            console.log(property);
            numAvailableAffordableUnits = numAvailableAffordableUnits + 1;
        }
        if (property.data__accepts_section_8) {
            numSection8Units = numSection8Units + 1;
        }
    }
    map.addLayer(markers);
}

function returnMap () {
    return map;
}

function initMap() {
    mymap = L.map('mapid', {zoomControl: false}).setView([30.2613, -97.7408], 12.5);
    return mymap;
}

function initTitleLayer() {
    return L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        // accessToken: 'pk.eyJ1Ijoicm1hdGh1cjEwMSIsImEiOiJjajg3a3I0cjIwb2lqMndtdGVtaWx1ZjZrIn0.iEel0XmzyrU4fz78lEQ3GQ'
        accessToken: mapbox_public_key
    });
}

// heart, home, or star are icon types
function assignMarker(color, iconType='home') {
    return L.AwesomeMarkers.icon({icon: iconType, markerColor: color, iconSize: [35, 45]})
}

var tempMarker = null;
var tempLat  = null;
var tempLong = null;
var tempMarkerId = null;

function removeSelectedMarker() {
    var property = properties[tempMarkerId];

    var map = returnMap();
    map.removeLayer(tempMarker);

    // var marker = L.marker([parseFloat(property.data__lat), parseFloat(property.data__longitude)], {icon: assignMarker(property.data__color, (property.data__color == 'orange' ? 'star' : 'home'))});
    // var marker = L.marker([parseFloat(property.data__lat), parseFloat(property.data__longitude)], {icon: assignMarker("blue")});
    var marker = L.marker([parseFloat(property.data__lat), parseFloat(property.data__longitude)], {icon: assignMarker(property.color)});
    marker.on("click", markerOnClick);
    marker.markerID = property.data__id;
    map.addLayer(marker);
}

function markerOnClick() {
    if (tempMarker) {
        removeSelectedMarker();
    }

    function shouldShowField(field) {
        if (!_.isNull(field)) {
            return true;
        } else {
            return false;
        }
    }

    var id = this.markerID;
    var property = properties[id];

    // console.log(property);

    tempMarkerId = id;
    tempLat = property.data__lat;
    tempLong = property.data__longitude;
    tempMarker = L.marker([parseFloat(property.data__lat), parseFloat(property.data__longitude)], {icon: assignMarker("red", "heart")});

    var map = returnMap();
    map.removeLayer(this);
    map.addLayer(tempMarker);

    console.log(id);
    console.log(property);

    var div = '';
    div += `
    <div style='margin-top: 20px;'>
        <button id='show-more'>SHOW MORE</button>
        <button id='cancel-btn'>x</button>
    </div>
    `;

    div += `<br/>`;

    div += '<div id="property-details">'

        div += `<div style='margin-top: 10px; font-size: 15px;'>${property.data__property_name}</div>`;
        div += `<div style='font-size: 15px;'>${property.data__address} ${property.data__city}, ${property.data__state} ${property.data__zipcode}</div>`;
        if (property.data__has_waitlist) {
            div += `<div class='waitlist-flag' style='font-size: 12px; width: 100px;'>WAITLIST</div>`;
        }
        if (property.data__accepts_section_8) {
            div += `<div class='waitlist-flag' style='font-size: 12px;'>ACCEPTS SECTION 8</div>`;
        }

        div += '<div class="property-details-container">'
            div += `<div class='property-details-header'><img class='img-sort img-sort-right' src='/sort-right.png'/><img class='img-sort img-sort-down' src='/sort-down.png'/>Contact Information</div>`;
            div +=  '<div class="property-details-group">';
                if (property.data__phone) {
                    div += `<div>Phone: ${property.data__phone}</div>`;
                }
                if (property.data__email) {
                    div += `<div>Email: ${property.data__email}</div>`;
                }
                if (property.data__website) {
                    div += `<div>Website: <a href=${property.data__website} target="_blank">${property.data__website}</a></div>`;
                }
            div += '</div>';
        div += '</div>';

        div += '<div class="property-details-container">'
            div += `<div class='property-details-header'><img class='img-sort img-sort-right' src='/sort-right.png'/><img class='img-sort img-sort-down' src='/sort-down.png'/>Communities Served</div>`;
            div +=  '<div class="property-details-group">';
                if (property.data__community_disabled) {
                    div += `<div>Physically Disabled Only</div>`;
                }
                if (property.data__community_domestic_abuse_survivor) {
                    div += `<div>Domestic Abuse Survivor Only</div>`;
                }
                if (property.data__community_elderly) {
                    div += `<div>Elderly Only</div>`;
                }
                if (property.data__community_mental) {
                    div += `<div>Mentally Disabled Only</div>`;
                }
                if (property.data__community_military) {
                    div += `<div>Military Only</div>`;
                }
                if (property.data__community_served_descriptions) {
                    div += `<div>Other Info: ${property.data__community_served_descriptions}</div>`;
                }
            div += '</div>';
        div += '</div>';

    div += '<div class="property-details-container">'
        div += `<div class='property-details-header'><img class='img-sort img-sort-right' src='/sort-right.png'/><img class='img-sort img-sort-down' src='/sort-down.png'/>Acceptance Criteria</div>`;
        div += '<div class="property-details-group">'
            if (property.data__broken_lease == 'no') {
                div += `<div>No, does not accept broken lease history</div>`;
            } else if (property.data__broken_lease == 'yes') {
                div += `<div>Yes, does accept broken lease history</div>`
            } else if (property.data__broken_lease == 'depends') {
                div += `<div>Broken lease history is accepted in some cases</div>`
                if (property.data__broken_lease_criteria) {
                    div += `<div>Other broken lease critiera: ${property.data__broken_lease_criteria}</div>`
                }
            }
            if (property.data__eviction_history == 'no') {
                div += `<div>No, does not accept eviction history</div>`;
            } else if (property.data__eviction_history == 'yes') {
                div += `<div>Yes, does accept eviction history</div>`;
            } else if (property.data__eviction_history == 'depends') {
                div += `<div>Eviction history accepted in some cases</div>`;
                if (property.data__eviction_history_criteria) {
                    div += `<div>Other eviction history critiera: ${property.data__eviction_history_criteria}</div>`
                }
            }
            if (property.data__criminal_history == 'no') {
                div += `<div>No, does not accept criminal history</div>`;
            } else if (property.data__criminal_history == 'yes') {
                div += `<div>Yes, does accept criminal history</div>`;
            } else if (property.data__criminal_history == 'depends') {
                div += `<div>Criminal history accepted in some cases</div>`;
                if (property.data__criminal_history_criteria) {
                    div += `<div>Other criminal history critiera: ${property.data__criminal_history_criteria}</div>`
                }
            }
        div += '</div>';
    div += '</div>';

    div += '<div class="property-details-container">'
        div += `<div class='property-details-header'><img class='img-sort img-sort-right' src='/sort-right.png'/><img class='img-sort img-sort-down' src='/sort-down.png'/>Amenities</div>`
        div += '<div class="property-details-group">'
            if (property.data__allows_pet == 'yes') {
                div += `<div>Yes, pets are allowed</div>`;
            } else if (property.data__allows_pet == 'no') {
                div += `<div>No, pets are not allowed</div>`;
            }
            if (property.data__pet_other) {
                div += `<div>Other pet info: ${property.data__pet_other}</div>`;
            }
            if (property.data__has_air_conditioning == 1) {
                div += `<div>Air Conditioning</div>`;
            } else if (property.data__has_air_conditioning == 0) {
                div += `<div>No Air Conditioning</div>`;
            }
            if (property.data__has_ceiling_fans == 1) {
                div += `<div>Ceiling Fans</div>`;
            } else if (property.data__has_ceiling_fans == 0) {
                div += `<div>No Ceiling Fans</div>`;
            }
            if (property.data__wd_unit == 1) {
                div += `<div>Washer Dryer In Unit</div>`;
            } else if (property.data__wd_unit == 0) {
                div += `<div>No Washer Dryer In Unit</div>`;
            }
            if (property.data__wd_hookups == 1) {
                div += `<div>Washer Dryer Hookups</div>`;
            } else if (property.data__wd_hookups == 0) {
                div += `<div>No Washer Dryer Hookups</div>`;
            }
            if (property.data__wd_onsite == 1) {
                div += `<div>Washer Dryer Onsite</div>`;
            } else if (property.data__wd_onsite == 0) {
                div += `<div>No Washer Dryer Onsite</div>`;
            }
            if (property.data__wd_other) {
                div += `<div>Other Washer / Dryer info: ${property.data__wd_other}</div>`;
            }
            if (property.data__wd_onsite == 1) {
                div += `<div>Washer Dryer Onsite</div>`;
            } else if (property.data__wd_onsite == 0) {
                div += `<div>No Washer Dryer Onsite</div>`;
            }
            if (property.data__has_off_street_parking == 1) {
                div += `<div>Has Off Street Parking</div>`;
            } else if (property.data__has_off_street_parking == 0) {
                div += `<div>No Off Street Parking</div>`;
            }
            if (property.data__security) {
                div += `<div>Security Information: ${property.data__security}</div>`;
            }
            if (property.data__has_pool == 1) {
                div += `<div>Yes Pool</div>`;
            } else if (property.data__has_pool == 0) {
                div += `<div>No Pool</div>`;
            }
            if (property.data__has_playground == 1) {
                div += `<div>Yes Playground</div>`;
            } else if (property.data__has_playgound == 0) {
                div += `<div>No Playground</div>`;
            }
        div += '</div>';
    div += '</div>';

    div += '<div class="property-details-container">'
        div += `<div class='property-details-header'><img class='img-sort img-sort-right' src='/sort-right.png'/><img class='img-sort img-sort-down' src='/sort-down.png'/>Schools</div>`;
        div += '<div class="property-details-group">'
            if (property.data__elementary_school) {
                div += `<div>Elementary School: ${property.data__elementary_school}</div>`;
            }
            if (property.data__middle_school) {
                div += `<div>Middle School: ${property.data__middle_school}</div>`;
            }
            if (property.data__high_school) {
                div += `<div>High School: ${property.data__high_school}</div>`;
            }
        div += '</div>';
    div += '</div>';

    div += '</div>';

    $('#property-info').html(div);

    $('.property-details-group').each(function() {
        var propertyDetailText = $(this).text().trim();

        // hide dropdown container if there is not content
        if (!propertyDetailText || propertyDetailText.length == 0) {
            $(this).closest('.property-details-container').hide();
        }
    });

    $('#filter-applied-banner').animate({width: '0px'}, 'slow', function() {$('#filter-applied-banner').hide();});
    $('#map-legend-banner').animate({width: '0px'}, 'slow', function() {$('#map-legend-banner').hide();});

    $('#property-info').show();
    $('#property-info').animate({height: '30%'}, 'slow');

    // TODO: check that this isn't adding too many handlers
    $('#show-more').click(function() {
        if ($('#show-more').text() == 'SHOW MORE') {
            $('#property-info').animate({height: '80%'}, 'slow');
            $('#show-more').text('SHOW LESS');
        } else {
            $('#property-info').animate({height: '30%'}, 'slow');
            $('#show-more').text('SHOW MORE');
        }
    });

    $('#cancel-btn').click(function() {
        $('#filter-applied-banner').show();
        $('#map-legend-banner').show();
        $('#filter-applied-banner').animate({width: '30px'}, 'slow');
        $('#map-legend-banner').animate({width: '30px'}, 'slow');

        $('#property-info').animate({height: '0%'}, 'slow', function() {$('#property-info').hide();});
        $('#show-more').text('SHOW LESS');
    });

    $('.property-details-header').click(function(e) {
        $(e.target).closest('.property-details-container').find('.property-details-group').toggle();
        $(e.target).closest('.property-details-container').find('.img-sort-right').toggle();
        $(e.target).closest('.property-details-container').find('.img-sort-down').toggle();
    });
}
