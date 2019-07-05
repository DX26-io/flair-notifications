const request = require('request');
const VisualizationUtils = require('./visualization-util');
var logger = require('../logger');

var AppConfig = require('../load_config');
const vizMetaApi = AppConfig.FlairBiEndPoint + "/api/external/visualMetaDataById";


var configs = {
    lineChartConfig: function (viz_id) {

        var chartconfigPromise = new Promise((resolve, reject) => {

            try {
                request(vizMetaApi + "/" + viz_id, function (error, response, body) {
                    if (error) {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: error.message,
                        });
                        reject(error.message);
                        return;
                    }
                    if (response && response.statusCode == 200) {
                        var json_res = JSON.parse(body);
                        var result = {};
                        var properties = json_res.visualMetadata.properties;
                        var fields = json_res.visualMetadata.fields;
                        var visualizationColors = json_res.visualizationColors;
                        var colorSet = [];
                        visualizationColors.forEach(function (obj) {
                            colorSet.push(obj.code)
                        });
                        var features = VisualizationUtils.getDimensionsAndMeasures(fields),
                            dimensions = features.dimensions,
                            measures = features.measures;

                        result['dimension'] = VisualizationUtils.getNames(dimensions);
                        result['measure'] = VisualizationUtils.getNames(measures);

                        result['maxMes'] = measures.length;

                        result['showXaxis'] = VisualizationUtils.getPropertyValue(properties, 'Show X Axis');
                        result['showYaxis'] = VisualizationUtils.getPropertyValue(properties, 'Show Y Axis');
                        result['xAxisColor'] = VisualizationUtils.getPropertyValue(properties, 'X Axis Colour');
                        result['yAxisColor'] = VisualizationUtils.getPropertyValue(properties, 'Y Axis Colour');
                        result['showXaxisLabel'] = VisualizationUtils.getPropertyValue(properties, 'Show X Axis Label');
                        result['showYaxisLabel'] = VisualizationUtils.getPropertyValue(properties, 'Show Y Axis Label');
                        result['showLegend'] = VisualizationUtils.getPropertyValue(properties, 'Show Legend');
                        result['legendPosition'] = VisualizationUtils.getPropertyValue(properties, 'Legend position');
                        result['showGrid'] = VisualizationUtils.getPropertyValue(properties, 'Show grid');
                        result['isFilterGrid'] = false;
                        result['displayName'] = VisualizationUtils.getFieldPropertyValue(dimensions[0], 'Display name') || result['dimension'][0];
                        result['showValues'] = [];
                        result['displayNameForMeasure'] = [];
                        result['fontStyle'] = [];
                        result['fontWeight'] = [];
                        result['fontSize'] = [];
                        result['numberFormat'] = [];
                        result['textColor'] = [];
                        result['displayColor'] = [];
                        result['borderColor'] = [];
                        result['lineType'] = [];
                        result['pointType'] = [];
                        for (var i = 0; i < result.maxMes; i++) {
                            result['showValues'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Value on Points'));
                            result['displayNameForMeasure'].push(
                                VisualizationUtils.getFieldPropertyValue(measures[i], 'Display name') ||
                                result['measure'][i]
                            );
                            result['fontStyle'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font style'));
                            result['fontWeight'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font weight'));
                            result['fontSize'].push(parseInt(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font size')));
                            result['numberFormat'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Number format'));
                            result['textColor'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Text colour'));
                            var displayColor = VisualizationUtils.getFieldPropertyValue(measures[i], 'Display colour');
                            result['displayColor'].push((displayColor == null) ? colorSet[i] : displayColor);
                            var borderColor = VisualizationUtils.getFieldPropertyValue(measures[i], 'Border colour');
                            result['borderColor'].push((borderColor == null) ? colorSet[i] : borderColor);
                            result['lineType'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Line Type'));
                            result['pointType'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Line Chart Point type'));
                        }
                        resolve(result);
                    }
                    else {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: JSON.parse(body).message,
                        });
                        reject(JSON.parse(body).message);
                    }
                });

            } catch (error) {
                logger.log({
                    level: 'error',
                    message: 'error while fetching config',
                    errMsg: error.message,
                });
                reject(error);
            }
        });

        return chartconfigPromise;

    },
    pieChartConfig: function (viz_id) {

        var chartconfigPromise = new Promise((resolve, reject) => {

            try {
                request(vizMetaApi + "/" + viz_id, function (error, response, body) {
                    if (error) {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: error.message,
                        });
                        reject(error.message);
                        return;
                    }
                    if (response && response.statusCode == 200) {
                        var json_res = JSON.parse(body);
                        var properties = json_res.visualMetadata.properties;
                        var fields = json_res.visualMetadata.fields;
                        var result = {};
                        var features = VisualizationUtils.getDimensionsAndMeasures(fields),
                            dimension = features.dimensions,
                            measure = features.measures;
                        result['dimension'] = VisualizationUtils.getNames(dimension);
                        result['measure'] = VisualizationUtils.getNames(measure);
                        result['legend'] = VisualizationUtils.getPropertyValue(properties, 'Show Legend');
                        result['legendPosition'] = VisualizationUtils.getPropertyValue(properties, 'Legend position').toLowerCase();
                        result['valueAs'] = VisualizationUtils.getPropertyValue(properties, 'Show value as').toLowerCase();
                        result['valueAsArc'] = VisualizationUtils.getPropertyValue(properties, 'Value as Arc');
                        result['valuePosition'] = VisualizationUtils.getPropertyValue(properties, 'Value position').toLowerCase();
                        resolve(result);
                    }
                    else {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: JSON.parse(body).message,
                        });
                        reject(JSON.parse(body).message);
                    }

                });
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: 'error while fetching config',
                    errMsg: error.message,
                });
                reject(error);
            }

        });

        return chartconfigPromise;

    },
    clusteredverticalBarConfig: function (viz_id) {

        var chartconfigPromise = new Promise((resolve, reject) => {

            try {
                request(vizMetaApi + "/" + viz_id, function (error, response, body) {
                    if (error) {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: error.message,
                        });
                        reject(error.message);
                        return;
                    }
                    if (response && response.statusCode == 200) {
                        var json_res = JSON.parse(body);
                        var properties = json_res.visualMetadata.properties;
                        var fields = json_res.visualMetadata.fields;
                        var visualizationColors = json_res.visualizationColors;
                        var colorSet = [];
                        visualizationColors.forEach(function (obj) {
                            colorSet.push(obj.code)
                        });
                        var features = VisualizationUtils.getDimensionsAndMeasures(fields),
                            dimensions = features.dimensions,
                            measures = features.measures;
                        var result = {};
                        result['dimension'] = VisualizationUtils.getNames(dimensions);
                        result['measure'] = VisualizationUtils.getNames(measures);
                        result['maxMes'] = measures.length;
                        result['showXaxis'] = VisualizationUtils.getPropertyValue(properties, 'Show X Axis');
                        result['showYaxis'] = VisualizationUtils.getPropertyValue(properties, 'Show Y Axis');
                        result['xAxisColor'] = VisualizationUtils.getPropertyValue(properties, 'X Axis Colour');
                        result['yAxisColor'] = VisualizationUtils.getPropertyValue(properties, 'Y Axis Colour');
                        result['showXaxisLabel'] = VisualizationUtils.getPropertyValue(properties, 'Show X Axis Label');
                        result['showYaxisLabel'] = VisualizationUtils.getPropertyValue(properties, 'Show Y Axis Label');
                        result['showLegend'] = VisualizationUtils.getPropertyValue(properties, 'Show Legend');
                        result['legendPosition'] = VisualizationUtils.getPropertyValue(properties, 'Legend position').toLowerCase();
                        result['showGrid'] = VisualizationUtils.getPropertyValue(properties, 'Show grid');
                        result['isFilterGrid'] = false;
                        result['displayName'] = VisualizationUtils.getFieldPropertyValue(dimensions[0], 'Display name') || result['dimension'][0];
                        result['showValues'] = [];
                        result['displayNameForMeasure'] = [];
                        result['fontStyle'] = [];
                        result['fontWeight'] = [];
                        result['fontSize'] = [];
                        result['numberFormat'] = [];
                        result['textColor'] = [];
                        result['displayColor'] = [];
                        result['borderColor'] = [];

                        for (var i = 0; i < result.maxMes; i++) {

                            result['showValues'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Value on Points'));
                            result['displayNameForMeasure'].push(
                                VisualizationUtils.getFieldPropertyValue(measures[i], 'Display name') ||
                                result['measure'][i]
                            );
                            result['fontStyle'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font style'));
                            result['fontWeight'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font weight'));
                            result['fontSize'].push(parseInt(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font size')));
                            result['numberFormat'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Number format'));
                            result['textColor'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Text colour'));
                            var displayColor = VisualizationUtils.getFieldPropertyValue(measures[i], 'Display colour');
                            result['displayColor'].push((displayColor == null) ? colorSet[i] : displayColor);
                            var borderColor = VisualizationUtils.getFieldPropertyValue(measures[i], 'Border colour');
                            result['borderColor'].push((borderColor == null) ? colorSet[i] : borderColor);
                        }

                        resolve(result);
                    }
                    else {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: JSON.parse(body).message,
                        });
                        reject(JSON.parse(body).message);
                    }


                });
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: 'error while fetching config',
                    errMsg: error.message,
                });
                reject(error);
            }




        });

        return chartconfigPromise;

    },
    clusteredhorizontalBarConfig: function (viz_id) {

        var chartconfigPromise = new Promise((resolve, reject) => {

            try {
                request(vizMetaApi + "/" + viz_id, function (error, response, body) {
                    if (error) {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: error.message,
                        });
                        reject(error.message);
                        return;
                    }
                    if (response && response.statusCode == 200) {
                        var json_res = JSON.parse(body);
                        var properties = json_res.visualMetadata.properties;
                        var fields = json_res.visualMetadata.fields;
                        var visualizationColors = json_res.visualizationColors;
                        var colorSet = [];
                        visualizationColors.forEach(function (obj) {
                            colorSet.push(obj.code)
                        });
                        var features = VisualizationUtils.getDimensionsAndMeasures(fields),
                            dimensions = features.dimensions,
                            measures = features.measures;
                        var result = {};
                        result['dimension'] = VisualizationUtils.getNames(dimensions);
                        result['measure'] = VisualizationUtils.getNames(measures);
                        result['maxMes'] = measures.length;
                        result['showXaxis'] = VisualizationUtils.getPropertyValue(properties, 'Show X Axis');
                        result['showYaxis'] = VisualizationUtils.getPropertyValue(properties, 'Show Y Axis');
                        result['xAxisColor'] = VisualizationUtils.getPropertyValue(properties, 'X Axis Colour');
                        result['yAxisColor'] = VisualizationUtils.getPropertyValue(properties, 'Y Axis Colour');
                        result['showXaxisLabel'] = VisualizationUtils.getPropertyValue(properties, 'Show X Axis Label');
                        result['showYaxisLabel'] = VisualizationUtils.getPropertyValue(properties, 'Show Y Axis Label');
                        result['showLegend'] = VisualizationUtils.getPropertyValue(properties, 'Show Legend');
                        result['legendPosition'] = VisualizationUtils.getPropertyValue(properties, 'Legend position').toLowerCase();
                        result['showGrid'] = VisualizationUtils.getPropertyValue(properties, 'Show grid');
                        result['isFilterGrid'] = false;
                        result['displayName'] = VisualizationUtils.getFieldPropertyValue(dimensions[0], 'Display name') || result['dimension'][0];
                        result['showValues'] = [];
                        result['displayNameForMeasure'] = [];
                        result['fontStyle'] = [];
                        result['fontWeight'] = [];
                        result['fontSize'] = [];
                        result['numberFormat'] = [];
                        result['textColor'] = [];
                        result['displayColor'] = [];
                        result['borderColor'] = [];


                        for (var i = 0; i < result.maxMes; i++) {

                            result['showValues'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Value on Points'));
                            result['displayNameForMeasure'].push(
                                VisualizationUtils.getFieldPropertyValue(measures[i], 'Display name') ||
                                result['measure'][i]
                            );
                            result['fontStyle'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font style'));
                            result['fontWeight'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font weight'));
                            result['fontSize'].push(parseInt(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font size')));
                            result['numberFormat'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Number format'));
                            result['textColor'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Text colour'));
                            var displayColor = VisualizationUtils.getFieldPropertyValue(measures[i], 'Display colour');
                            result['displayColor'].push((displayColor == null) ? colorSet[i] : displayColor);
                            var borderColor = VisualizationUtils.getFieldPropertyValue(measures[i], 'Border colour');
                            result['borderColor'].push((borderColor == null) ? colorSet[i] : borderColor);
                        }

                        resolve(result);
                    }
                    else {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: JSON.parse(body).message,
                        });
                        reject(JSON.parse(body).message);
                    }


                });
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: 'error while fetching config',
                    errMsg: error.message,
                });
                reject(error);
            }
        });

        return chartconfigPromise;

    },
    stackedverticalBarConfig: function (viz_id) {

        var chartconfigPromise = new Promise((resolve, reject) => {

            try {
                request(vizMetaApi + "/" + viz_id, function (error, response, body) {
                    if (error) {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: error.message,
                        });
                        reject(error.message);
                        return;
                    }
                    if (response && response.statusCode == 200) {
                        var json_res = JSON.parse(body);
                        var properties = json_res.visualMetadata.properties;
                        var fields = json_res.visualMetadata.fields;
                        var visualizationColors = json_res.visualizationColors;
                        var colorSet = [];
                        visualizationColors.forEach(function (obj) {
                            colorSet.push(obj.code)
                        });
                        var vis
                        var features = VisualizationUtils.getDimensionsAndMeasures(fields),
                            dimensions = features.dimensions,
                            measures = features.measures;
                        var result = {};
                        result['dimension'] = VisualizationUtils.getNames(dimensions);
                        result['measure'] = VisualizationUtils.getNames(measures);
                        result['maxMes'] = measures.length;
                        result['showXaxis'] = VisualizationUtils.getPropertyValue(properties, 'Show X Axis');
                        result['showYaxis'] = VisualizationUtils.getPropertyValue(properties, 'Show Y Axis');
                        result['xAxisColor'] = VisualizationUtils.getPropertyValue(properties, 'X Axis Colour');
                        result['yAxisColor'] = VisualizationUtils.getPropertyValue(properties, 'Y Axis Colour');
                        result['showXaxisLabel'] = VisualizationUtils.getPropertyValue(properties, 'Show X Axis Label');
                        result['showYaxisLabel'] = VisualizationUtils.getPropertyValue(properties, 'Show Y Axis Label');
                        result['showLegend'] = VisualizationUtils.getPropertyValue(properties, 'Show Legend');
                        result['legendPosition'] = VisualizationUtils.getPropertyValue(properties, 'Legend position').toLowerCase();
                        result['showGrid'] = VisualizationUtils.getPropertyValue(properties, 'Show grid');
                        result['isFilterGrid'] = false;
                        result['displayName'] = VisualizationUtils.getFieldPropertyValue(dimensions[0], 'Display name') || result['dimension'][0];
                        result['showValues'] = [];
                        result['displayNameForMeasure'] = [];
                        result['fontStyle'] = [];
                        result['fontWeight'] = [];
                        result['fontSize'] = [];
                        result['numberFormat'] = [];
                        result['textColor'] = [];
                        result['displayColor'] = [];
                        result['borderColor'] = [];
                        for (var i = 0; i < result.maxMes; i++) {
                            result['showValues'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Value on Points'));
                            result['displayNameForMeasure'].push(
                                VisualizationUtils.getFieldPropertyValue(measures[i], 'Display name') ||
                                result['measure'][i]
                            );
                            result['fontStyle'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font style'));
                            result['fontWeight'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font weight'));
                            result['fontSize'].push(parseInt(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font size')));
                            result['numberFormat'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Number format'));
                            result['textColor'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Text colour'));
                            var displayColor = VisualizationUtils.getFieldPropertyValue(measures[i], 'Display colour');
                            result['displayColor'].push((displayColor == null) ? colorSet[i] : displayColor);
                            var borderColor = VisualizationUtils.getFieldPropertyValue(measures[i], 'Border colour');
                            result['borderColor'].push((borderColor == null) ? colorSet[i] : borderColor);
                        }

                        resolve(result);
                    }
                    else {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: JSON.parse(body).message,
                        });
                        reject(JSON.parse(body).message);
                    }

                });
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: 'error while fetching config',
                    errMsg: error.message,
                });
                reject(error);
            }
        });

        return chartconfigPromise;

    },
    tableChartConfig: function (viz_id) {

        var chartconfigPromise = new Promise((resolve, reject) => {

            try {
                request(vizMetaApi + "/" + viz_id, function (error, response, body) {
                    if (error) {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: error.message,
                        });
                        reject(error.message);
                        return;
                    }
                    if (response && response.statusCode == 200) {
                        var json_res = JSON.parse(body);
                        var result = {};
                        var properties = json_res.visualMetadata.properties;
                        var fields = json_res.visualMetadata.fields;
                        var visualizationColors = json_res.visualizationColors;
                        var colorSet = [];
                        visualizationColors.forEach(function (obj) {
                            colorSet.push(obj.code)
                        });
                        var features = VisualizationUtils.getDimensionsAndMeasures(fields),
                            dimensions = features.dimensions,
                            measures = features.measures;

                        result['dimension'] = VisualizationUtils.getNames(dimensions);
                        result['measure'] = VisualizationUtils.getNames(measures);

                        result['maxDim'] = dimensions.length;
                        result['maxMes'] = measures.length;

                        result["displayNameForDimension"] = [];
                        result["cellColorForDimension"] = [];
                        result["fontStyleForDimension"] = [];
                        result["fontWeightForDimension"] = [];
                        result["fontSizeForDimension"] = [];
                        result["textColorForDimension"] = [];
                        result["textColorExpressionForDimension"] = [];
                        result["textAlignmentForDimension"] = [];

                        result["displayNameForMeasure"] = [];
                        result["cellColorForMeasure"] = [];
                        result["cellColorExpressionForMeasure"] = [];
                        result["fontStyleForMeasure"] = [];
                        result["fontSizeForMeasure"] = [];
                        result["fontWeightForMeasure"] = [];
                        result["numberFormatForMeasure"] = [];
                        result["textColorForMeasure"] = [];
                        result["textAlignmentForMeasure"] = [];
                        result["textColorExpressionForMeasure"] = [];
                        result["iconNameForMeasure"] = [];
                        result["iconFontWeight"] = [];
                        result["iconColor"] = [];
                        result["iconPositionForMeasure"] = [];
                        result["iconExpressionForMeasure"] = [];

                        for (var i = 0; i < result.maxDim; i++) {
                            result['displayNameForDimension'].push(
                                VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Display name') ||
                                result['dimension'][i]
                            );
                            result['cellColorForDimension'].push(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Cell colour'));
                            result['fontStyleForDimension'].push(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Font style'));
                            result['fontWeightForDimension'].push(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Font weight'));
                            result['fontSizeForDimension'].push(parseInt(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Font size')));
                            result['textColorForDimension'].push(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Text colour'));
                            result['textColorExpressionForDimension'].push(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Text colour expression'));
                            result['textAlignmentForDimension'].push(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Alignment'));
                        }

                        for (var i = 0; i < result.maxMes; i++) {
                            result['displayNameForMeasure'].push(
                                VisualizationUtils.getFieldPropertyValue(measures[i], 'Display name') ||
                                result['measure'][i]
                            );
                            result['cellColorForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Cell colour'));
                            result['cellColorExpressionForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Cell colour expression'));
                            result['fontStyleForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font style'));
                            result['fontWeightForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font weight'));
                            result['fontSizeForMeasure'].push(parseInt(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font size')));
                            result['numberFormatForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Number format'));
                            result['textColorForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Text colour'));
                            result['textAlignmentForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Text alignment').toLowerCase());
                            result['textColorExpressionForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Text colour expression'));
                            result['iconNameForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Icon name'));
                            result['iconPositionForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Icon position'));
                            result['iconExpressionForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Icon Expression'));
                        }
                        resolve(result);
                    }
                    else {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: JSON.parse(body).message,
                        });
                        reject(JSON.parse(body).message);
                    }


                });
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: 'error while fetching config',
                    errMsg: error.message,
                });
                reject(error);
            }

        });

        return chartconfigPromise;

    },
    pivottableChartConfig: function (viz_id) {
        var chartconfigPromise = new Promise((resolve, reject) => {
            try {
                request(vizMetaApi + "/" + viz_id, function (error, response, body) {
                    if (error) {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: error.message,
                        });
                        reject(error.message);
                        return;
                    }
                    if (response && response.statusCode == 200) {
                        var json_res = JSON.parse(body);
                        var result = {};
                        var properties = json_res.visualMetadata.properties;
                        var fields = json_res.visualMetadata.fields;
                        var visualizationColors = json_res.visualizationColors;
                        var colorSet = [];
                        visualizationColors.forEach(function (obj) {
                            colorSet.push(obj.code)
                        });
                        var features = VisualizationUtils.getDimensionsAndMeasures(fields),
                            dimensions = features.dimensions,
                            measures = features.measures;

                        result['dimension'] = VisualizationUtils.getNames(dimensions);
                        result['measure'] = VisualizationUtils.getNames(measures);

                        result['maxDim'] = dimensions.length;
                        result['maxMes'] = measures.length;

                        result["displayNameForDimension"] = [];
                        result["cellColorForDimension"] = [];
                        result["fontStyleForDimension"] = [];
                        result["fontWeightForDimension"] = [];
                        result["fontSizeForDimension"] = [];
                        result["textColorForDimension"] = [];
                        result["textColorExpressionForDimension"] = [];
                        result["textAlignmentForDimension"] = [];
                        result['isPivoted'] = [];

                        result["displayNameForMeasure"] = [];
                        result["cellColorForMeasure"] = [];
                        result["cellColorExpressionForMeasure"] = [];
                        result["fontStyleForMeasure"] = [];
                        result["fontSizeForMeasure"] = [];
                        result["fontWeightForMeasure"] = [];
                        result["numberFormatForMeasure"] = [];
                        result["textColorForMeasure"] = [];
                        result["textAlignmentForMeasure"] = [];
                        result["textColorExpressionForMeasure"] = [];
                        result["iconNameForMeasure"] = [];
                        result["iconFontWeight"] = [];
                        result["iconColor"] = [];
                        result["iconPositionForMeasure"] = [];
                        result["iconExpressionForMeasure"] = [];
                        for (var i = 0; i < result.maxDim; i++) {
                            result['displayNameForDimension'].push(
                                VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Display name') ||
                                result['dimension'][i]
                            );
                            result['cellColorForDimension'].push(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Cell colour'));
                            result['fontStyleForDimension'].push(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Font style'));
                            result['fontWeightForDimension'].push(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Font weight'));
                            result['fontSizeForDimension'].push(parseInt(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Font size')));
                            result['textColorForDimension'].push(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Text colour'));
                            result['textColorExpressionForDimension'].push(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Text colour expression'));
                            result['textAlignmentForDimension'].push(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Alignment'));
                            result['isPivoted'].push(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Pivot'));

                        }

                        for (var i = 0; i < result.maxMes; i++) {
                            result['displayNameForMeasure'].push(
                                VisualizationUtils.getFieldPropertyValue(measures[i], 'Display name') ||
                                result['measure'][i]
                            );
                            result['cellColorForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Cell colour'));
                            result['cellColorExpressionForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Cell colour expression'));
                            result['fontStyleForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font style'));
                            result['fontWeightForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font weight'));
                            result['fontSizeForMeasure'].push(parseInt(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font size')));
                            result['numberFormatForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Number format'));
                            result['textColorForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Text colour'));
                            result['textAlignmentForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Text alignment').toLowerCase());
                            result['textColorExpressionForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Text colour expression'));
                            result['iconNameForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Icon name'));
                            result['iconPositionForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Icon position'));
                            result['iconExpressionForMeasure'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Icon Expression'));
                        }
                        resolve(result);
                    }
                    else {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: JSON.parse(body).message,
                        });
                        reject(JSON.parse(body).message);
                    }
                });
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: 'error while fetching config',
                    errMsg: error.message,
                });
                reject(error);
            }
        });
        return chartconfigPromise;
    },
    stackedHorizontalBarConfig: function (viz_id) {

        var chartconfigPromise = new Promise((resolve, reject) => {

            try {
                request(vizMetaApi + "/" + viz_id, function (error, response, body) {
                    if (error) {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: error.message,
                        });
                        reject(error.message);
                        return;
                    }
                    if (response && response.statusCode == 200) {
                        var json_res = JSON.parse(body);
                        var properties = json_res.visualMetadata.properties;
                        var fields = json_res.visualMetadata.fields;
                        var visualizationColors = json_res.visualizationColors;
                        var colorSet = [];
                        visualizationColors.forEach(function (obj) {
                            colorSet.push(obj.code)
                        });
                        var features = VisualizationUtils.getDimensionsAndMeasures(fields),
                            dimensions = features.dimensions,
                            measures = features.measures;
                        var result = {};
                        result['dimension'] = VisualizationUtils.getNames(dimensions);
                        result['measure'] = VisualizationUtils.getNames(measures);
                        result['maxMes'] = measures.length;
                        result['showXaxis'] = VisualizationUtils.getPropertyValue(properties, 'Show X Axis');
                        result['showYaxis'] = VisualizationUtils.getPropertyValue(properties, 'Show Y Axis');
                        result['xAxisColor'] = VisualizationUtils.getPropertyValue(properties, 'X Axis Colour');
                        result['yAxisColor'] = VisualizationUtils.getPropertyValue(properties, 'Y Axis Colour');
                        result['showXaxisLabel'] = VisualizationUtils.getPropertyValue(properties, 'Show X Axis Label');
                        result['showYaxisLabel'] = VisualizationUtils.getPropertyValue(properties, 'Show Y Axis Label');
                        result['showLegend'] = VisualizationUtils.getPropertyValue(properties, 'Show Legend');
                        result['legendPosition'] = VisualizationUtils.getPropertyValue(properties, 'Legend position').toLowerCase();
                        result['showGrid'] = VisualizationUtils.getPropertyValue(properties, 'Show grid');
                        result['isFilterGrid'] = false;
                        result['displayName'] = VisualizationUtils.getFieldPropertyValue(dimensions[0], 'Display name') || result['dimension'][0];
                        result['showValues'] = [];
                        result['displayNameForMeasure'] = [];
                        result['fontStyle'] = [];
                        result['fontWeight'] = [];
                        result['fontSize'] = [];
                        result['numberFormat'] = [];
                        result['textColor'] = [];
                        result['displayColor'] = [];
                        result['borderColor'] = [];
                        for (var i = 0; i < result.maxMes; i++) {
                            result['showValues'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Value on Points'));
                            result['displayNameForMeasure'].push(
                                VisualizationUtils.getFieldPropertyValue(measures[i], 'Display name') ||
                                result['measure'][i]
                            );
                            result['fontStyle'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font style'));
                            result['fontWeight'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font weight'));
                            result['fontSize'].push(parseInt(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font size')));
                            result['numberFormat'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Number format'));
                            result['textColor'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Text colour'));
                            var displayColor = VisualizationUtils.getFieldPropertyValue(measures[i], 'Display colour');
                            result['displayColor'].push((displayColor == null) ? colorSet[i] : displayColor);
                            var borderColor = VisualizationUtils.getFieldPropertyValue(measures[i], 'Border colour');
                            result['borderColor'].push((borderColor == null) ? colorSet[i] : borderColor);
                        }

                        resolve(result);
                    }
                    else {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: JSON.parse(body).message,
                        });
                        reject(JSON.parse(body).message);
                    }


                });
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: 'error while fetching config',
                    errMsg: error.message,
                });
                reject(error);
            }
        });

        return chartconfigPromise;

    },
    DoughnutChartConfig: function (viz_id) {

        var chartconfigPromise = new Promise((resolve, reject) => {

            try {
                request(vizMetaApi + "/" + viz_id, function (error, response, body) {
                    if (error) {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: error.message,
                        });
                        reject(error.message);
                        return;
                    }
                    if (response && response.statusCode == 200) {
                        var json_res = JSON.parse(body);
                        var properties = json_res.visualMetadata.properties;
                        var fields = json_res.visualMetadata.fields;
                        var result = {};
                        var features = VisualizationUtils.getDimensionsAndMeasures(fields),
                            dimension = features.dimensions,
                            measure = features.measures;
                        result['dimension'] = VisualizationUtils.getNames(dimension);
                        result['measure'] = VisualizationUtils.getNames(measure);
                        result['dimensionDisplayName'] = VisualizationUtils.getFieldPropertyValue(dimension[0], 'Display name') || result['dimension'][0];
                        result['measureDisplayName'] = VisualizationUtils.getFieldPropertyValue(measure[0], 'Display name') || result['measure'][0];

                        result['fontSize'] = VisualizationUtils.getFieldPropertyValue(measure[0], 'Font size');
                        result['fontStyle'] = VisualizationUtils.getFieldPropertyValue(measure[0], 'Font style');
                        result['fontWeight'] = VisualizationUtils.getFieldPropertyValue(measure[0], 'Font weight');
                        result['showLabel'] = VisualizationUtils.getFieldPropertyValue(measure[0], 'Show Labels');
                        result['fontColor'] = VisualizationUtils.getFieldPropertyValue(measure[0], 'Colour of labels');

                        result['legend'] = VisualizationUtils.getPropertyValue(properties, 'Show Legend');
                        result['legendPosition'] = VisualizationUtils.getPropertyValue(properties, 'Legend position').toLowerCase();
                        result['valueAs'] = VisualizationUtils.getPropertyValue(properties, 'Show value as').toLowerCase();
                        result['valueAsArc'] = VisualizationUtils.getPropertyValue(properties, 'Value as Arc');
                        result['valuePosition'] = VisualizationUtils.getPropertyValue(properties, 'Value position').toLowerCase();

                        resolve(result);
                    }
                    else {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: JSON.parse(body).message,
                        });
                        reject(JSON.parse(body).message);
                    }

                });
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: 'error while fetching config',
                    errMsg: error.message,
                });
                reject(error);
            }

        });

        return chartconfigPromise;

    },
    KPIChartConfig: function (viz_id) {

        var chartconfigPromise = new Promise((resolve, reject) => {

            try {
                request(vizMetaApi + "/" + viz_id, function (error, response, body) {
                    if (error) {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: error.message,
                        });
                        reject(error.message);
                        return;
                    }
                    if (response && response.statusCode == 200) {
                        var json_res = JSON.parse(body);
                        var properties = json_res.visualMetadata.properties;
                        var fields = json_res.visualMetadata.fields;
                        var result = {};
                        var features = VisualizationUtils.getDimensionsAndMeasures(fields),
                            dimension = features.dimensions,
                            measures = features.measures;
                        result['dimension'] = VisualizationUtils.getNames(dimension);
                        result['measure'] = VisualizationUtils.getNames(measures);
                        result['kpiDisplayName'] = [];
                        result['kpiAlignment'] = [];
                        result['kpiBackgroundColor'] = [];
                        result['kpiNumberFormat'] = [];
                        result['kpiFontStyle'] = [];
                        result['kpiFontWeight'] = [];
                        result['kpiFontSize'] = [];
                        result['kpiColor'] = [];
                        result['kpiColorExpression'] = [];
                        result['kpiIcon'] = [];
                        result['kpiIconFontWeight'] = [];
                        result['kpiIconColor'] = [];
                        result['kpiIconExpression'] = [];
                        result['FontSizeforDisplayName'] = [];
                        for (var i = 0; i < measures.length; i++) {
                            result['kpiDisplayName'].push(
                                VisualizationUtils.getFieldPropertyValue(measures[i], 'Display name') ||
                                result['measure'][i]
                            );
                            result['kpiAlignment'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Text alignment'));
                            result['kpiBackgroundColor'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Background Colour'));
                            result['kpiNumberFormat'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Number format'));
                            result['kpiFontStyle'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font style'));
                            result['kpiFontWeight'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font weight'));
                            result['kpiFontSize'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font size'));
                            result['kpiColor'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Text colour'));
                            result['kpiColorExpression'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Text colour expression'));
                            result['kpiIcon'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Icon name'));
                            result['kpiIconFontWeight'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Icon Font weight'));
                            result['kpiIconColor'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Icon colour'));
                            result['kpiIconExpression'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Icon Expression'));
                            result['FontSizeforDisplayName'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font size for diplay name'));
                        }
                        resolve(result);
                    }
                    else {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: JSON.parse(body).message,
                        });
                        reject(JSON.parse(body).message);
                    }

                });
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: 'error while fetching config',
                    errMsg: error.message,
                });
                reject(error);
            }

        });

        return chartconfigPromise;

    },
    comboChartConfig: function (viz_id) {

        var chartconfigPromise = new Promise((resolve, reject) => {

            try {
                request(vizMetaApi + "/" + viz_id, function (error, response, body) {
                    if (error) {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: error.message,
                        });
                        reject(error.message);
                        return;
                    }
                    if (response && response.statusCode == 200) {
                        var json_res = JSON.parse(body);
                        var result = {};
                        var properties = json_res.visualMetadata.properties;
                        var fields = json_res.visualMetadata.fields;
                        var visualizationColors = json_res.visualizationColors;
                        var colorSet = [];
                        visualizationColors.forEach(function (obj) {
                            colorSet.push(obj.code)
                        });
                        var features = VisualizationUtils.getDimensionsAndMeasures(fields),
                            dimensions = features.dimensions,
                            measures = features.measures;

                        result['dimension'] = VisualizationUtils.getNames(dimensions);
                        result['measure'] = VisualizationUtils.getNames(measures);

                        result['maxMes'] = measures.length;

                        result['showXaxis'] = VisualizationUtils.getPropertyValue(properties, 'Show X Axis');
                        result['showYaxis'] = VisualizationUtils.getPropertyValue(properties, 'Show Y Axis');
                        result['xAxisColor'] = VisualizationUtils.getPropertyValue(properties, 'X Axis Colour');
                        result['yAxisColor'] = VisualizationUtils.getPropertyValue(properties, 'Y Axis Colour');
                        result['showXaxisLabel'] = VisualizationUtils.getPropertyValue(properties, 'Show X Axis Label');
                        result['showYaxisLabel'] = VisualizationUtils.getPropertyValue(properties, 'Show Y Axis Label');
                        result['showLegend'] = VisualizationUtils.getPropertyValue(properties, 'Show Legend');
                        result['legendPosition'] = VisualizationUtils.getPropertyValue(properties, 'Legend position');
                        result['showGrid'] = VisualizationUtils.getPropertyValue(properties, 'Show grid');
                        result['isFilterGrid'] = false;
                        result['displayName'] = VisualizationUtils.getFieldPropertyValue(dimensions[0], 'Display name') || result['dimension'][0];
                        result['showValues'] = [];
                        result['displayNameForMeasure'] = [];
                        result['fontStyle'] = [];
                        result['fontWeight'] = [];
                        result['fontSize'] = [];
                        result['numberFormat'] = [];
                        result['textColor'] = [];
                        result['displayColor'] = [];
                        result['borderColor'] = [];
                        result['comboChartType'] = [];
                        result['lineType'] = [];
                        result['pointType'] = [];
                        for (var i = 0; i < result.maxMes; i++) {
                            result['showValues'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Value on Points'));
                            result['displayNameForMeasure'].push(
                                VisualizationUtils.getFieldPropertyValue(measures[i], 'Display name') ||
                                result['measure'][i]
                            );
                            result['fontStyle'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font style'));
                            result['fontWeight'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font weight'));
                            result['fontSize'].push(parseInt(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font size')));
                            result['numberFormat'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Number format'));
                            result['textColor'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Text colour'));
                            var displayColor = VisualizationUtils.getFieldPropertyValue(measures[i], 'Display colour');
                            result['displayColor'].push((displayColor == null) ? colorSet[i] : displayColor);
                            var borderColor = VisualizationUtils.getFieldPropertyValue(measures[i], 'Border colour');
                            result['borderColor'].push((borderColor == null) ? colorSet[i] : borderColor);
                            result['comboChartType'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Combo chart type'));
                            result['lineType'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Line Type'));
                            result['pointType'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Line Chart Point type'));
                        }
                        resolve(result);
                    }
                    else {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: JSON.parse(body).message,
                        });
                        reject(JSON.parse(body).message);
                    }
                });

            } catch (error) {
                logger.log({
                    level: 'error',
                    message: 'error while fetching config',
                    errMsg: error.message,
                });
                reject(error);
            }
        });

        return chartconfigPromise;

    },
    infographicsChartConfig: function (viz_id) {

        var chartconfigPromise = new Promise((resolve, reject) => {

            try {
                request(vizMetaApi + "/" + viz_id, function (error, response, body) {
                    if (error) {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: error.message,
                        });
                        reject(error.message);
                        return;
                    }
                    if (response && response.statusCode == 200) {
                        var json_res = JSON.parse(body);
                        var result = {};
                        var properties = json_res.visualMetadata.properties;
                        var fields = json_res.visualMetadata.fields;
                        var visualizationColors = json_res.visualizationColors;
                        var colorSet = [];
                        visualizationColors.forEach(function (obj) {
                            colorSet.push(obj.code)
                        });
                        var features = VisualizationUtils.getDimensionsAndMeasures(fields),
                            dimensions = features.dimensions,
                            measures = features.measures;

                        result['dimension'] = VisualizationUtils.getNames(dimensions);
                        result['measure'] = VisualizationUtils.getNames(measures);

                        result['chartType'] = VisualizationUtils.getPropertyValue(properties, 'Info graphic Type').toLowerCase();
                        var displayColor = VisualizationUtils.getFieldPropertyValue(dimensions[0], 'Display colour');
                        result['chartDisplayColor'] = (displayColor == null) ? colorSet[0] : displayColor;
                        var borderColor = VisualizationUtils.getFieldPropertyValue(dimensions[0], 'Border colour');
                        result['chartBorderColor'] = (borderColor == null) ? colorSet[0] : borderColor;

                        result['kpiDisplayName'] = VisualizationUtils.getFieldPropertyValue(measures[0], 'Display name') || result['dimension'][0];
                        result['kpiAlignment'] = VisualizationUtils.getFieldPropertyValue(measures[0], 'Text alignment');
                        result['kpiBackgroundColor'] = VisualizationUtils.getFieldPropertyValue(measures[0], 'Background Colour');
                        result['kpiNumberFormat'] = VisualizationUtils.getFieldPropertyValue(measures[0], 'Number format');
                        result['kpiFontStyle'] = VisualizationUtils.getFieldPropertyValue(measures[0], 'Font style');
                        result['kpiFontWeight'] = VisualizationUtils.getFieldPropertyValue(measures[0], 'Font weight');
                        result['kpiFontSize'] = VisualizationUtils.getFieldPropertyValue(measures[0], 'Font size');
                        result['kpiColor'] = VisualizationUtils.getFieldPropertyValue(measures[0], 'Text colour');
                        result['kpiColorExpression'] = VisualizationUtils.getFieldPropertyValue(measures[0], 'Text colour expression');
                        result['kpiIcon'] = VisualizationUtils.getFieldPropertyValue(measures[0], 'Icon name');
                        result['kpiIconFontWeight'] = VisualizationUtils.getFieldPropertyValue(measures[0], 'Icon Font weight');
                        result['kpiIconColor'] = VisualizationUtils.getFieldPropertyValue(measures[0], 'Icon colour');
                        result['kpiIconExpression'] = VisualizationUtils.getFieldPropertyValue(measures[0], 'Icon Expression');
                        resolve(result);
                    }
                    else {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: JSON.parse(body).message,
                        });
                        reject(JSON.parse(body).message);
                    }
                });

            } catch (error) {
                logger.log({
                    level: 'error',
                    message: 'error while fetching config',
                    errMsg: error.message,
                });
                reject(error);
            }
        });

        return chartconfigPromise;

    },
    treemapChartConfig: function (viz_id) {

        var chartconfigPromise = new Promise((resolve, reject) => {

            try {
                request(vizMetaApi + "/" + viz_id, function (error, response, body) {
                    if (error) {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: error.message,
                        });
                        reject(error.message);
                        return;
                    }
                    if (response && response.statusCode == 200) {
                        var json_res = JSON.parse(body);
                        var result = {};
                        var properties = json_res.visualMetadata.properties;
                        var fields = json_res.visualMetadata.fields;
                        var visualizationColors = json_res.visualizationColors;
                        var colorSet = [];
                        visualizationColors.forEach(function (obj) {
                            colorSet.push(obj.code)
                        });
                        var features = VisualizationUtils.getDimensionsAndMeasures(fields),
                            dimensions = features.dimensions,
                            measures = features.measures;

                        result['maxDim'] = dimensions.length;
                        result['colorPattern'] = VisualizationUtils.getFieldPropertyValue(measures[0], 'Color Pattern').toLowerCase().replace(' ', '_');
                        result['showValues'] = VisualizationUtils.getFieldPropertyValue(measures[0], 'Value on Points');
                        result['valueTextColour'] = VisualizationUtils.getFieldPropertyValue(measures[0], 'Text colour');
                        result['fontStyleForMes'] = VisualizationUtils.getFieldPropertyValue(measures[0], 'Font style');
                        result['fontWeightForMes'] = VisualizationUtils.getFieldPropertyValue(measures[0], 'Font weight');
                        result['fontSizeForMes'] = parseInt(VisualizationUtils.getFieldPropertyValue(measures[0], 'Font size'));
                        result['numberFormat'] = VisualizationUtils.getFieldPropertyValue(measures[0], 'Number format');
                        result['measure'] = [measures[0].feature.name];
                        result['dimension'] = [];
                        result['showLabelForDimension'] = [];
                        result['labelColorForDimension'] = [];
                        result['fontStyleForDimension'] = [];
                        result['fontWeightForDimension'] = [];
                        result['fontSizeForDimension'] = [];
                        result['displayColor'] = [];
                        result['colorSet'] = colorSet;

                        for (var i = 0, j = ''; i < result.maxDim; i++ , j = i + 1) {
                            result['dimension'].push(dimensions[i].feature.name);
                            result['showLabelForDimension'].push(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Show Labels'));
                            result['labelColorForDimension'].push(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Colour of labels'));
                            var displayColor = VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Display colour');
                            result['displayColor'].push((displayColor == null) ? colorSet[i] : displayColor);
                            result['fontWeightForDimension'].push(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Font weight'));
                            result['fontStyleForDimension'].push(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Font style'));
                            result['fontSizeForDimension'].push(parseInt(VisualizationUtils.getFieldPropertyValue(dimensions[i], 'Font size')));
                        }
                        resolve(result);
                    }
                    else {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: JSON.parse(body).message,
                        });
                        reject(JSON.parse(body).message);
                    }
                });

            } catch (error) {
                logger.log({
                    level: 'error',
                    message: 'error while fetching config',
                    errMsg: error.message,
                });
                reject(error);
            }
        });

        return chartconfigPromise;

    },
    scatterplotConfig: function (viz_id) {

        var chartconfigPromise = new Promise((resolve, reject) => {

            try {
                request(vizMetaApi + "/" + viz_id, function (error, response, body) {
                    if (error) {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: error.message,
                        });
                        reject(error.message);
                        return;
                    }
                    if (response && response.statusCode == 200) {
                        var json_res = JSON.parse(body);
                        var properties = json_res.visualMetadata.properties;
                        var fields = json_res.visualMetadata.fields;
                        var visualizationColors = json_res.visualizationColors;
                        var colorSet = [];
                        visualizationColors.forEach(function (obj) {
                            colorSet.push(obj.code)
                        });
                        var features = VisualizationUtils.getDimensionsAndMeasures(fields),
                            dimensions = features.dimensions,
                            measures = features.measures;
                        var result = {};
                        result['dimension'] = VisualizationUtils.getNames(dimensions);
                        result['measure'] = VisualizationUtils.getNames(measures);
                        result['maxMes'] = measures.length;

                        result['showXaxis'] = VisualizationUtils.getPropertyValue(properties, 'Show X Axis');
                        result['showYaxis'] = VisualizationUtils.getPropertyValue(properties, 'Show Y Axis');
                        result['xAxisColor'] = VisualizationUtils.getPropertyValue(properties, 'X Axis Colour');
                        result['yAxisColor'] = VisualizationUtils.getPropertyValue(properties, 'Y Axis Colour');
                        result['showXaxisLabel'] = VisualizationUtils.getPropertyValue(properties, 'Show X Axis Label');
                        result['showYaxisLabel'] = VisualizationUtils.getPropertyValue(properties, 'Show Y Axis Label');
                        result['showLegend'] = VisualizationUtils.getPropertyValue(properties, 'Show Legend');
                        result['legendPosition'] = VisualizationUtils.getPropertyValue(properties, 'Legend position').toLowerCase();
                        result['showGrid'] = VisualizationUtils.getPropertyValue(properties, 'Show grid');

                        result['displayName'] = VisualizationUtils.getFieldPropertyValue(dimensions[0], 'Display name') || result['dimension'][0];
                        result['showValues'] = [];
                        result['displayNameForMeasure'] = [];
                        result['fontStyle'] = [];
                        result['fontWeight'] = [];
                        result['fontSize'] = [];
                        result['numberFormat'] = [];
                        result['textColor'] = [];
                        result['displayColor'] = [];
                        result['borderColor'] = [];
                        for (var i = 0; i < result.maxMes; i++) {
                            result['showValues'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Value on Points'));
                            result['displayNameForMeasure'].push(
                                VisualizationUtils.getFieldPropertyValue(measures[i], 'Display name') ||
                                result['measure'][i]
                            );
                            result['fontStyle'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font style'));
                            result['fontWeight'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font weight'));
                            result['fontSize'].push(parseInt(VisualizationUtils.getFieldPropertyValue(measures[i], 'Font size')));
                            result['numberFormat'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Number format'));
                            result['textColor'].push(VisualizationUtils.getFieldPropertyValue(measures[i], 'Text colour'));
                            var displayColor = VisualizationUtils.getFieldPropertyValue(measures[i], 'Display colour');
                            result['displayColor'].push((displayColor == null) ? colorSet[i] : displayColor);
                            var borderColor = VisualizationUtils.getFieldPropertyValue(measures[i], 'Border colour');
                            result['borderColor'].push((borderColor == null) ? colorSet[i] : borderColor);
                        }

                        resolve(result);
                    }
                    else {
                        logger.log({
                            level: 'error',
                            message: 'error while fetching config',
                            errMsg: JSON.parse(body).message,
                        });
                        reject(JSON.parse(body).message);
                    }
                });
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: 'error while fetching config',
                    errMsg: error.message,
                });
                reject(error);
            }
        });

        return chartconfigPromise;

    },
}

module.exports = configs;