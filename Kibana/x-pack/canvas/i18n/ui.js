"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewStrings = exports.TransformStrings = exports.ModelStrings = exports.DataSourceStrings = exports.ArgumentStrings = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ArgumentStrings = {
  AxisConfig: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.axisConfigTitle', {
      defaultMessage: 'Axis config'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.axisConfigLabel', {
      defaultMessage: 'Visualization axis configuration'
    }),
    getDisabledText: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.axisConfigDisabledText', {
      defaultMessage: 'Switch on to view axis settings'
    }),
    getPositionBottom: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.axisConfig.position.options.bottomDropDown', {
      defaultMessage: 'bottom'
    }),
    getPositionLabel: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.axisConfig.positionLabel', {
      defaultMessage: 'Position'
    }),
    getPositionLeft: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.axisConfig.position.options.leftDropDown', {
      defaultMessage: 'left'
    }),
    getPositionRight: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.axisConfig.position.options.rightDropDown', {
      defaultMessage: 'right'
    }),
    getPositionTop: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.axisConfig.position.options.topDropDown', {
      defaultMessage: 'top'
    })
  },
  DataColumn: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.dataColumnTitle', {
      defaultMessage: 'Column'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.dataColumnLabel', {
      defaultMessage: 'Select the data column'
    }),
    getOptionAverage: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.dataColumn.options.averageDropDown', {
      defaultMessage: 'Average'
    }),
    getOptionCount: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.dataColumn.options.countDropDown', {
      defaultMessage: 'Count'
    }),
    getOptionFirst: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.dataColumn.options.firstDropDown', {
      defaultMessage: 'First'
    }),
    getOptionLast: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.dataColumn.options.lastDropDown', {
      defaultMessage: 'Last'
    }),
    getOptionMax: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.dataColumn.options.maxDropDown', {
      defaultMessage: 'Max'
    }),
    getOptionMedian: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.dataColumn.options.medianDropDown', {
      defaultMessage: 'Median'
    }),
    getOptionMin: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.dataColumn.options.minDropDown', {
      defaultMessage: 'Min'
    }),
    getOptionSum: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.dataColumn.options.sumDropDown', {
      defaultMessage: 'Sum'
    }),
    getOptionUnique: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.dataColumn.options.uniqueDropDown', {
      defaultMessage: 'Unique'
    }),
    getOptionValue: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.dataColumn.options.valueDropDown', {
      defaultMessage: 'Value'
    })
  },
  DateFormat: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.dateFormatTitle', {
      defaultMessage: 'Date Format'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.dateFormatLabel', {
      defaultMessage: 'Select or enter a {momentJS} format',
      values: {
        momentJS: _constants.MOMENTJS
      }
    })
  },
  FilterGroup: {
    getCreateNewGroup: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.filterGroup.createNewGroupLinkText', {
      defaultMessage: 'Create new group'
    }),
    getButtonSet: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.filterGroup.setValue', {
      defaultMessage: 'Set'
    }),
    getButtonCancel: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.filterGroup.cancelValue', {
      defaultMessage: 'Cancel'
    }),
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.filterGroupTitle', {
      defaultMessage: 'Filter Group'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.filterGroupLabel', {
      defaultMessage: 'Create or select a filter group'
    })
  },
  ImageUpload: {
    getAssetUrlType: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.imageUpload.urlTypes.assetDropDown', {
      defaultMessage: 'Asset'
    }),
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.imageUploadTitle', {
      defaultMessage: 'Image upload'
    }),
    getFileUploadPrompt: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.imageUpload.fileUploadPromptLabel', {
      defaultMessage: 'Select or drag and drop an image'
    }),
    getFileUrlType: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.imageUpload.urlTypes.fileDropDown', {
      defaultMessage: 'Import'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.imageUploadLabel', {
      defaultMessage: 'Select or upload an image'
    }),
    getImageUploading: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.imageUpload.imageUploadingLabel', {
      defaultMessage: 'Image uploading'
    }),
    getLinkUrlType: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.imageUpload.urlTypes.linkDropDown', {
      defaultMessage: 'Link'
    }),
    getUrlFieldPlaceholder: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.imageUpload.urlFieldPlaceholder', {
      defaultMessage: 'Image {url}',
      values: {
        url: _constants.URL
      }
    }),
    getUrlTypeChangeLegend: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.imageUpload.urlTypes.changeLegend', {
      defaultMessage: 'Image upload type'
    })
  },
  Number: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.numberTitle', {
      defaultMessage: 'Number'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.numberLabel', {
      defaultMessage: 'Input a number'
    })
  },
  NumberFormat: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.numberFormatTitle', {
      defaultMessage: 'Number Format'
    }),
    getFormatBytes: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.numberFormat.format.bytesDropDown', {
      defaultMessage: 'Bytes'
    }),
    getFormatCurrency: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.numberFormat.format.currencyDropDown', {
      defaultMessage: 'Currency'
    }),
    getFormatDuration: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.numberFormat.format.durationDropDown', {
      defaultMessage: 'Duration'
    }),
    getFormatNumber: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.numberFormat.format.numberDropDown', {
      defaultMessage: 'Number'
    }),
    getFormatPercent: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.numberFormat.format.percentDropDown', {
      defaultMessage: 'Percent'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.numberFormatLabel', {
      defaultMessage: 'Select or enter a valid {numeralJS} format',
      values: {
        numeralJS: _constants.NUMERALJS
      }
    })
  },
  Palette: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.paletteTitle', {
      defaultMessage: 'Color palette'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.paletteLabel', {
      defaultMessage: 'The collection of colors used to render the element'
    }),
    getCustomPaletteLabel: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.customPaletteLabel', {
      defaultMessage: 'Custom'
    })
  },
  Color: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.colorTitle', {
      defaultMessage: 'Color'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.colorLabel', {
      defaultMessage: 'Color picker'
    })
  },
  Percentage: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.percentageTitle', {
      defaultMessage: 'Percentage'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.percentageLabel', {
      defaultMessage: 'Slider for percentage '
    })
  },
  Range: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.rangeTitle', {
      defaultMessage: 'Range'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.rangeLabel', {
      defaultMessage: 'Slider for values within a range'
    })
  },
  Select: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.selectTitle', {
      defaultMessage: 'Select'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.selectLabel', {
      defaultMessage: 'Select from multiple options in a drop down'
    })
  },
  Shape: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.shapeTitle', {
      defaultMessage: 'Shape'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.shapeLabel', {
      defaultMessage: 'Change the shape of the current element'
    })
  },
  String: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.stringTitle', {
      defaultMessage: 'String'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.stringLabel', {
      defaultMessage: 'Input short strings'
    })
  },
  Textarea: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.textareaTitle', {
      defaultMessage: 'Textarea'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.textareaLabel', {
      defaultMessage: 'Input long strings'
    })
  },
  Toggle: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.toggleTitle', {
      defaultMessage: 'Toggle'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.toggleLabel', {
      defaultMessage: 'A true/false toggle switch'
    })
  },
  VisDimension: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.visDimensionTitle', {
      defaultMessage: 'Column'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.visDimensionLabel', {
      defaultMessage: 'Generates visConfig dimension object'
    }),
    getDefaultOptionName: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.visDimensionDefaultOptionName', {
      defaultMessage: 'Select column'
    })
  },
  StopsPalette: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.stopsPaletteTitle', {
      defaultMessage: 'Palette picker with bounds'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.arguments.stopsPaletteLabel', {
      defaultMessage: 'Provides colors for the values, based on the bounds'
    })
  }
};
exports.ArgumentStrings = ArgumentStrings;
const DataSourceStrings = {
  // Demo data source
  DemoData: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.demoDataTitle', {
      defaultMessage: 'Demo data'
    }),
    getHeading: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.demoData.headingTitle', {
      defaultMessage: 'This element is using demo data'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.demoDataLabel', {
      defaultMessage: 'Sample data set used to populate default elements'
    }),
    getDescription: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.demoDataDescription', {
      defaultMessage: 'By default, every {canvas} element is connected to the demo data source. Change the data source, above, to connect your own data.',
      values: {
        canvas: _constants.CANVAS
      }
    })
  },
  // Elasticsearch documents datasource
  ESDocs: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.esdocsTitle', {
      defaultMessage: '{elasticsearch} documents',
      values: {
        elasticsearch: _constants.ELASTICSEARCH
      }
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.esdocsLabel', {
      defaultMessage: 'Pull data directly from {elasticsearch} without the use of aggregations',
      values: {
        elasticsearch: _constants.ELASTICSEARCH
      }
    }),
    getWarningTitle: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.esdocs.warningTitle', {
      defaultMessage: 'Query with caution'
    }),
    getWarning: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.esdocs.warningDescription', {
      defaultMessage: `
        Using this data source with larger data sets can result in slower performance. Use this source only when you need exact values.`
    }),
    getIndexTitle: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.esdocs.indexTitle', {
      defaultMessage: 'Index'
    }),
    getIndexLabel: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.esdocs.indexLabel', {
      defaultMessage: 'Enter an index name or select a data view'
    }),
    getQueryTitle: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.esdocs.queryTitle', {
      defaultMessage: 'Query'
    }),
    getQueryLabel: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.esdocs.queryLabel', {
      defaultMessage: '{lucene} query string syntax',
      values: {
        lucene: _constants.LUCENE
      }
    }),
    getSortFieldTitle: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.esdocs.sortFieldTitle', {
      defaultMessage: 'Sort field'
    }),
    getSortFieldLabel: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.esdocs.sortFieldLabel', {
      defaultMessage: 'Document sort field'
    }),
    getSortOrderTitle: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.esdocs.sortOrderTitle', {
      defaultMessage: 'Sort order'
    }),
    getSortOrderLabel: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.esdocs.sortOrderLabel', {
      defaultMessage: 'Document sort order'
    }),
    getFieldsTitle: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.esdocs.fieldsTitle', {
      defaultMessage: 'Fields'
    }),
    getFieldsLabel: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.esdocs.fieldsLabel', {
      defaultMessage: 'Scripted fields are unavailable'
    }),
    getFieldsWarningLabel: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.esdocs.fieldsWarningLabel', {
      defaultMessage: 'This datasource performs best with 10 or fewer fields'
    }),
    getAscendingOption: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.esdocs.ascendingDropDown', {
      defaultMessage: 'Ascending'
    }),
    getDescendingOption: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.esdocs.descendingDropDown', {
      defaultMessage: 'Descending'
    })
  },
  // Elasticsearch SQL data source
  Essql: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.essqlTitle', {
      defaultMessage: '{elasticsearch} {sql}',
      values: {
        elasticsearch: _constants.ELASTICSEARCH,
        sql: _constants.SQL
      }
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.essqlLabel', {
      defaultMessage: 'Write an {elasticsearch} {sql} query to retrieve data',
      values: {
        elasticsearch: _constants.ELASTICSEARCH,
        sql: _constants.SQL
      }
    }),
    getLabel: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.essql.queryTitle', {
      defaultMessage: 'Query'
    }),
    getLabelAppend: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.essql.queryTitleAppend', {
      defaultMessage: 'Learn {elasticsearchShort} {sql} query syntax',
      values: {
        elasticsearchShort: _constants.ELASTICSEARCH_SHORT,
        sql: _constants.SQL
      }
    })
  },
  // Timelion datasource
  Timelion: {
    getAbout: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.timelion.aboutDetail', {
      defaultMessage: 'Use {timelion} syntax in {canvas} to retrieve timeseries data',
      values: {
        timelion: _constants.TIMELION,
        canvas: _constants.CANVAS
      }
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.timelionLabel', {
      defaultMessage: 'Use {timelion} syntax to retrieve timeseries data',
      values: {
        timelion: _constants.TIMELION
      }
    }),
    getIntervalHelp: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.timelion.intervalLabel', {
      defaultMessage: 'Use date math like {weeksExample}, {daysExample}, {secondsExample}, or {auto}',
      values: {
        secondsExample: '10s',
        daysExample: '5d',
        weeksExample: '1w',
        auto: 'auto'
      }
    }),
    getIntervalLabel: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.timelion.intervalTitle', {
      defaultMessage: 'Interval'
    }),
    queryLabel: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.timelion.queryLabel', {
      defaultMessage: '{timelion} Query String syntax',
      values: {
        timelion: _constants.TIMELION
      }
    }),
    getQueryLabel: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.timelion.queryTitle', {
      defaultMessage: 'Query'
    }),
    getTipsHeading: () => _i18n.i18n.translate('xpack.canvas.uis.dataSources.timelion.tipsTitle', {
      defaultMessage: 'Tips for using {timelion} in {canvas}',
      values: {
        timelion: _constants.TIMELION,
        canvas: _constants.CANVAS
      }
    })
  }
};
exports.DataSourceStrings = DataSourceStrings;
const ModelStrings = {
  Math: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.mathTitle', {
      defaultMessage: 'Measure'
    }),
    getValueDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.math.args.valueTitle', {
      defaultMessage: 'Value'
    }),
    getValueHelp: () => _i18n.i18n.translate('xpack.canvas.uis.models.math.args.valueLabel', {
      defaultMessage: 'Function and column to use in extracting a value from the datasource'
    })
  },
  PointSeries: {
    getColorDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.pointSeries.args.colorTitle', {
      defaultMessage: 'Color'
    }),
    getColorHelp: () => _i18n.i18n.translate('xpack.canvas.uis.models.pointSeries.args.colorLabel', {
      defaultMessage: 'Determines the color of a mark or series'
    }),
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.pointSeriesTitle', {
      defaultMessage: 'Dimensions & measures'
    }),
    getSizeDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.pointSeries.args.sizeTitle', {
      defaultMessage: 'Size'
    }),
    getSizeHelp: () => _i18n.i18n.translate('xpack.canvas.uis.models.pointSeries.args.sizeLabel', {
      defaultMessage: 'Determine the size of a mark'
    }),
    getTextDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.pointSeries.args.textTitle', {
      defaultMessage: 'Text'
    }),
    getTextHelp: () => _i18n.i18n.translate('xpack.canvas.uis.models.pointSeries.args.textLabel', {
      defaultMessage: 'Set the text to use as, or around, the mark'
    }),
    getXAxisDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.pointSeries.args.xaxisTitle', {
      defaultMessage: 'X-axis'
    }),
    getXAxisHelp: () => _i18n.i18n.translate('xpack.canvas.uis.models.pointSeries.args.xaxisLabel', {
      defaultMessage: 'Data along the horizontal axis. Usually a number, string or date'
    }),
    getYaxisDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.pointSeries.args.yaxisTitle', {
      defaultMessage: 'Y-axis'
    }),
    getYaxisHelp: () => _i18n.i18n.translate('xpack.canvas.uis.models.pointSeries.args.yaxisLabel', {
      defaultMessage: 'Data along the vertical axis. Usually a number'
    })
  },
  HeatmapLegend: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_legend.title', {
      defaultMessage: "Configure the heatmap chart's legend"
    }),
    getIsVisibleDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_legend.args.isVisibleTitle', {
      defaultMessage: 'Show legend'
    }),
    getIsVisibleHelp: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_legend.args.isVisibleLabel', {
      defaultMessage: 'Specifies whether or not the legend is visible'
    }),
    getPositionDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_legend.args.positionTitle', {
      defaultMessage: 'Legend Position'
    }),
    getPositionHelp: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_legend.args.positionLabel', {
      defaultMessage: 'Specifies the legend position.'
    }),
    getPositionTopOption: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_legend.args.positionTopLabel', {
      defaultMessage: 'Top'
    }),
    getPositionBottomOption: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_legend.args.positionBottomLabel', {
      defaultMessage: 'Bottom'
    }),
    getPositionLeftOption: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_legend.args.positionLeftLabel', {
      defaultMessage: 'Left'
    }),
    getPositionRightOption: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_legend.args.positionRightLabel', {
      defaultMessage: 'Right'
    }),
    getMaxLinesDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_legend.args.maxLinesTitle', {
      defaultMessage: 'Legend maximum lines'
    }),
    getMaxLinesHelp: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_legend.args.maxLinesLabel', {
      defaultMessage: 'Specifies the number of lines per legend item.'
    }),
    getShouldTruncateDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_legend.args.shouldTruncateTitle', {
      defaultMessage: 'Truncate label'
    }),
    getShouldTruncateHelp: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_legend.args.shouldTruncateLabel', {
      defaultMessage: 'Specifies whether or not the legend items should be truncated'
    })
  },
  HeatmapGrid: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_grid.title', {
      defaultMessage: 'Configure the heatmap layout'
    }),
    getStrokeWidthDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_grid.args.strokeWidthTitle', {
      defaultMessage: 'Stroke width'
    }),
    getStrokeWidthHelp: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_grid.args.strokeWidthLabel', {
      defaultMessage: 'Specifies the grid stroke width'
    }),
    getStrokeColorDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_grid.args.strokeColorTitle', {
      defaultMessage: 'Stroke color'
    }),
    getStrokeColorHelp: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_grid.args.strokeColorLabel', {
      defaultMessage: 'Specifies the grid stroke color'
    }),
    getIsCellLabelVisibleDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_grid.args.isCellLabelVisibleTitle', {
      defaultMessage: 'Show cell label'
    }),
    getIsCellLabelVisibleHelp: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_grid.args.isCellLabelVisibleLabel', {
      defaultMessage: 'Specifies whether or not the cell label is visible'
    }),
    getIsYAxisLabelVisibleDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_grid.args.isYAxisLabelVisibleTile', {
      defaultMessage: 'Show Y-axis labels'
    }),
    getIsYAxisLabelVisibleHelp: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_grid.args.isYAxisLabelVisibleLabel', {
      defaultMessage: 'Specifies whether or not the Y-axis labels are visible'
    }),
    getIsYAxisTitleVisibleDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_grid.args.isYAxisTitleVisibleTile', {
      defaultMessage: 'Show Y-axis title'
    }),
    getIsYAxisTitleVisibleHelp: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_grid.args.isYAxisTitleVisibleLabel', {
      defaultMessage: 'Specifies whether or not the Y-axis title is visible'
    }),
    getIsXAxisLabelVisibleDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_grid.args.isXAxisLabelVisibleTile', {
      defaultMessage: 'Show X-axis labels'
    }),
    getIsXAxisLabelVisibleHelp: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_grid.args.isXAxisLabelVisibleLabel', {
      defaultMessage: 'Specifies whether or not the X-axis labels are visible'
    }),
    getIsXAxisTitleVisibleDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_grid.args.isXAxisTitleVisibleTile', {
      defaultMessage: 'Show X-axis title'
    }),
    getIsXAxisTitleVisibleHelp: () => _i18n.i18n.translate('xpack.canvas.uis.models.heatmap_grid.args.isXAxisTitleVisibleLabel', {
      defaultMessage: 'Specifies whether or not the X-axis title is visible'
    })
  }
};
exports.ModelStrings = ModelStrings;
const TransformStrings = {
  FormatDate: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.transforms.formatDateTitle', {
      defaultMessage: 'Date format'
    }),
    getFormatDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.transforms.formatDate.args.formatTitle', {
      defaultMessage: 'Format'
    })
  },
  FormatNumber: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.transforms.formatNumberTitle', {
      defaultMessage: 'Number format'
    }),
    getFormatDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.transforms.formatNumber.args.formatTitle', {
      defaultMessage: 'Format'
    })
  },
  RoundDate: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.transforms.roundDateTitle', {
      defaultMessage: 'Round date'
    }),
    getFormatDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.transforms.roundDate.args.formatTitle', {
      defaultMessage: 'Format'
    }),
    getFormatHelp: () => _i18n.i18n.translate('xpack.canvas.uis.transforms.roundDate.args.formatLabel', {
      defaultMessage: 'Select or enter a {momentJs} format to round the date',
      values: {
        momentJs: _constants.MOMENTJS
      }
    })
  },
  Sort: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.transforms.sortTitle', {
      defaultMessage: 'Datatable sorting'
    }),
    getReverseDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.transforms.sort.args.reverseToggleSwitch', {
      defaultMessage: 'Descending'
    }),
    getSortFieldDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.transforms.sort.args.sortFieldTitle', {
      defaultMessage: 'Sort field'
    })
  }
};
exports.TransformStrings = TransformStrings;
const ViewStrings = {
  DropdownControl: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.dropdownControlTitle', {
      defaultMessage: 'Dropdown filter'
    }),
    getFilterDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.dropdownControl.args.filterColumnTitle', {
      defaultMessage: 'Filter column'
    }),
    getFilterGroupDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.dropdownControl.args.filterGroupTitle', {
      defaultMessage: 'Filter group'
    }),
    getFilterGroupHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.dropdownControl.args.filterGroupLabel', {
      defaultMessage: "Apply the selected group name to an element's filters function to target this filter"
    }),
    getFilterHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.dropdownControl.args.filterColumnLabel', {
      defaultMessage: 'Column to which the value selected from the dropdown is applied'
    }),
    getValueDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.dropdownControl.args.valueColumnTitle', {
      defaultMessage: 'Value column'
    }),
    getValueHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.dropdownControl.args.valueColumnLabel', {
      defaultMessage: 'Column from which to extract values to make available in the dropdown'
    })
  },
  GetCell: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.getCellTitle', {
      defaultMessage: 'Dropdown filter'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.getCellLabel', {
      defaultMessage: 'Grab the first row and first column'
    })
  },
  Image: {
    getContainMode: () => _i18n.i18n.translate('xpack.canvas.uis.views.image.args.mode.containDropDown', {
      defaultMessage: 'Contain'
    }),
    getCoverMode: () => _i18n.i18n.translate('xpack.canvas.uis.views.image.args.mode.coverDropDown', {
      defaultMessage: 'Cover'
    }),
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.imageTitle', {
      defaultMessage: 'Image'
    }),
    getModeDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.image.args.modeTitle', {
      defaultMessage: 'Fill mode'
    }),
    getModeHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.image.args.modeLabel', {
      defaultMessage: 'Note: Stretched fill may not work with vector images'
    }),
    getStretchMode: () => _i18n.i18n.translate('xpack.canvas.uis.views.image.args.mode.stretchDropDown', {
      defaultMessage: 'Stretch'
    })
  },
  Markdown: {
    getContentDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.markdown.args.contentTitle', {
      defaultMessage: '{markdown} content',
      values: {
        markdown: _constants.MARKDOWN
      }
    }),
    getContentHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.markdown.args.contentLabel', {
      defaultMessage: '{markdown} formatted text',
      values: {
        markdown: _constants.MARKDOWN
      }
    }),
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.markdownTitle', {
      defaultMessage: '{markdown}',
      values: {
        markdown: _constants.MARKDOWN
      }
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.markdownLabel', {
      defaultMessage: 'Generate markup using {markdown}',
      values: {
        markdown: _constants.MARKDOWN
      }
    }),
    getOpenLinksInNewTabDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.openLinksInNewTabTitle', {
      defaultMessage: 'Markdown link settings'
    }),
    getOpenLinksInNewTabLabelName: () => _i18n.i18n.translate('xpack.canvas.uis.views.openLinksInNewTabLabel', {
      defaultMessage: 'Open all links in a new tab'
    }),
    getOpenLinksInNewTabHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.openLinksInNewTabHelpLabel', {
      defaultMessage: 'Set links to open in new tab'
    })
  },
  Metric: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.metricTitle', {
      defaultMessage: 'Metric'
    }),
    getNumberDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.numberArgTitle', {
      defaultMessage: 'Value'
    }),
    getLabelDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.metric.args.labelArgTitle', {
      defaultMessage: 'Label'
    }),
    getLabelFontDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.metric.args.labelFontTitle', {
      defaultMessage: 'Label text'
    }),
    getLabelFontHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.metric.args.labelFontLabel', {
      defaultMessage: 'Fonts, alignment and color'
    }),
    getLabelHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.metric.args.labelArgLabel', {
      defaultMessage: 'Enter a text label for the metric value'
    }),
    getMetricFontDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.metric.args.metricFontTitle', {
      defaultMessage: 'Metric text'
    }),
    getMetricFontHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.metric.args.metricFontLabel', {
      defaultMessage: 'Fonts, alignment and color'
    }),
    getMetricFormatDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.metric.args.metricFormatTitle', {
      defaultMessage: 'Format'
    }),
    getMetricFormatHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.metric.args.metricFormatLabel', {
      defaultMessage: 'Select a format for the metric value'
    })
  },
  Pie: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.pieTitle', {
      defaultMessage: 'Chart style'
    }),
    getHoleDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.pie.args.holeTitle', {
      defaultMessage: 'Inner radius'
    }),
    getHoleHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.pie.args.holeLabel', {
      defaultMessage: 'Radius of the hole'
    }),
    getLabelRadiusDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.pie.args.labelRadiusTitle', {
      defaultMessage: 'Label radius'
    }),
    getLabelRadiusHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.pie.args.labelRadiusLabel', {
      defaultMessage: 'Distance of the labels from the center of the pie'
    }),
    getLabelsDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.pie.args.labelsTitle', {
      defaultMessage: 'Labels'
    }),
    getLabelsToggleSwitch: () => _i18n.i18n.translate('xpack.canvas.uis.views.pie.args.labelsToggleSwitch', {
      defaultMessage: 'Show labels'
    }),
    getLabelsHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.pie.args.labelsLabel', {
      defaultMessage: 'Show/hide labels'
    }),
    getLegendDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.pie.args.legendTitle', {
      defaultMessage: 'Legend'
    }),
    getLegendHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.pie.args.legendLabel', {
      defaultMessage: 'Disable or position the legend'
    }),
    getRadiusDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.pie.args.radiusTitle', {
      defaultMessage: 'Radius'
    }),
    getRadiusHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.pie.args.radiusLabel', {
      defaultMessage: 'Radius of the pie'
    }),
    getTiltDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.pie.args.tiltTitle', {
      defaultMessage: 'Tilt angle'
    }),
    getTiltHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.pie.args.tiltLabel', {
      defaultMessage: 'Percentage of tilt where 100 is fully vertical and 0 is completely flat'
    })
  },
  Plot: {
    getDefaultStyleDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.plot.args.defaultStyleTitle', {
      defaultMessage: 'Default style'
    }),
    getDefaultStyleHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.plot.args.defaultStyleLabel', {
      defaultMessage: 'Set the style to be used by default by every series, unless overridden'
    }),
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.plotTitle', {
      defaultMessage: 'Chart style'
    }),
    getLegendDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.plot.args.legendTitle', {
      defaultMessage: 'Legend'
    }),
    getLegendHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.plot.args.legendLabel', {
      defaultMessage: 'Disable or position the legend'
    }),
    getXaxisDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.plot.args.xaxisTitle', {
      defaultMessage: 'X-axis'
    }),
    getXaxisHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.plot.args.xaxisLabel', {
      defaultMessage: 'Configure or disable the x-axis'
    }),
    getYaxisDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.plot.args.yaxisTitle', {
      defaultMessage: 'Y-axis'
    }),
    getYaxisHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.plot.args.yaxisLabel', {
      defaultMessage: 'Configure or disable the Y-axis'
    })
  },
  Progress: {
    getBarColorDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.progress.args.barColorTitle', {
      defaultMessage: 'Background color'
    }),
    getBarColorHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.progress.args.barColorLabel', {
      defaultMessage: 'Accepts HEX, RGB or HTML color names'
    }),
    getBarWeightDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.progress.args.barWeightTitle', {
      defaultMessage: 'Background weight'
    }),
    getBarWeightHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.progress.args.barWeightLabel', {
      defaultMessage: 'Thickness of the background bar'
    }),
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.progressTitle', {
      defaultMessage: 'Progress'
    }),
    getFontDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.progress.args.fontTitle', {
      defaultMessage: 'Label settings'
    }),
    getFontHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.progress.args.fontLabel', {
      defaultMessage: 'Font settings for the label. Technically, you can add other styles as well'
    }),
    getLabelDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.progress.args.labelArgTitle', {
      defaultMessage: 'Label'
    }),
    getLabelHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.progress.args.labelArgLabel', {
      defaultMessage: `Set {true}/{false} to show/hide label or provide a string to display as the label`,
      values: {
        true: _constants.BOOLEAN_TRUE,
        false: _constants.BOOLEAN_FALSE
      }
    }),
    getMaxDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.progress.args.maxTitle', {
      defaultMessage: 'Maximum value'
    }),
    getMaxHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.progress.args.maxLabel', {
      defaultMessage: 'Maximum value of the progress element'
    }),
    getShapeDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.progress.args.shapeTitle', {
      defaultMessage: 'Shape'
    }),
    getShapeHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.progress.args.shapeLabel', {
      defaultMessage: 'Shape of the progress indicator'
    }),
    getValueColorDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.progress.args.valueColorTitle', {
      defaultMessage: 'Progress color'
    }),
    getValueColorHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.progress.args.valueColorLabel', {
      defaultMessage: 'Accepts {hex}, {rgb} or {html} Color names',
      values: {
        html: _constants.HTML,
        hex: _constants.HEX,
        rgb: _constants.RGB
      }
    }),
    getValueWeightDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.progress.args.valueWeightTitle', {
      defaultMessage: 'Progress weight'
    }),
    getValueWeightHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.progress.args.valueWeightLabel', {
      defaultMessage: 'Thickness of the progress bar'
    })
  },
  Render: {
    getCssApply: () => _i18n.i18n.translate('xpack.canvas.uis.views.render.args.css.applyButtonLabel', {
      defaultMessage: 'Apply Stylesheet'
    }),
    getCssHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.render.args.cssLabel', {
      defaultMessage: 'A {css} stylesheet scoped to your element',
      values: {
        css: _constants.CSS
      }
    }),
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.renderTitle', {
      defaultMessage: 'Element style'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.renderLabel', {
      defaultMessage: 'Setting for the container around your element'
    })
  },
  RepeatImage: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.repeatImageTitle', {
      defaultMessage: 'Repeating image'
    }),
    getEmptyImageDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.repeatImage.args.emptyImageTitle', {
      defaultMessage: 'Empty image'
    }),
    getEmptyImageHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.repeatImage.args.emptyImageLabel', {
      defaultMessage: 'An image to fill up the difference between the value and the max count'
    }),
    getImageDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.repeatImage.args.imageTitle', {
      defaultMessage: 'Image'
    }),
    getImageHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.repeatImage.args.imageLabel', {
      defaultMessage: 'An image to repeat'
    }),
    getMaxDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.repeatImage.args.maxTitle', {
      defaultMessage: 'Max count'
    }),
    getMaxHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.repeatImage.args.maxLabel', {
      defaultMessage: 'The maximum number of repeated images'
    }),
    getSizeDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.repeatImage.args.sizeTitle', {
      defaultMessage: 'Image size'
    }),
    getSizeHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.repeatImage.args.sizeLabel', {
      defaultMessage: 'The size of the largest dimension of the image. Eg, if the image is tall but not wide, this is the height'
    })
  },
  RevealImage: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.revealImageTitle', {
      defaultMessage: 'Reveal image'
    }),
    getEmptyImageDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.revealImage.args.emptyImageTitle', {
      defaultMessage: 'Background image'
    }),
    getEmptyImageHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.revealImage.args.emptyImageLabel', {
      defaultMessage: 'A background image. Eg, an empty glass'
    }),
    getImageDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.revealImage.args.imageTitle', {
      defaultMessage: 'Image'
    }),
    getImageHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.revealImage.args.imageLabel', {
      defaultMessage: 'An image to reveal given the function input. Eg, a full glass'
    }),
    getOriginBottom: () => _i18n.i18n.translate('xpack.canvas.uis.views.revealImage.args.origin.bottomDropDown', {
      defaultMessage: 'Bottom'
    }),
    getOriginDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.revealImage.args.originTitle', {
      defaultMessage: 'Reveal from'
    }),
    getOriginHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.revealImage.args.originLabel', {
      defaultMessage: 'The direction from which to start the reveal'
    }),
    getOriginLeft: () => _i18n.i18n.translate('xpack.canvas.uis.views.revealImage.args.origin.leftDropDown', {
      defaultMessage: 'Left'
    }),
    getOriginRight: () => _i18n.i18n.translate('xpack.canvas.uis.views.revealImage.args.origin.rightDropDown', {
      defaultMessage: 'Right'
    }),
    getOriginTop: () => _i18n.i18n.translate('xpack.canvas.uis.views.revealImage.args.origin.topDropDown', {
      defaultMessage: 'Top'
    })
  },
  Shape: {
    getBorderDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.shape.args.borderTitle', {
      defaultMessage: 'Border'
    }),
    getBorderHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.shape.args.borderLabel', {
      defaultMessage: 'Accepts HEX, RGB or HTML color names'
    }),
    getBorderWidthDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.shape.args.borderWidthTitle', {
      defaultMessage: 'Border width'
    }),
    getBorderWidthHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.shape.args.borderWidthLabel', {
      defaultMessage: 'Border width'
    }),
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.shapeTitle', {
      defaultMessage: 'Shape'
    }),
    getFillDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.shape.args.fillTitle', {
      defaultMessage: 'Fill'
    }),
    getFillHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.shape.args.fillLabel', {
      defaultMessage: 'Accepts HEX, RGB or HTML color names'
    }),
    getMaintainAspectDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.shape.args.maintainAspectTitle', {
      defaultMessage: 'Aspect ratio settings'
    }),
    getMaintainAspectLabelName: () => _i18n.i18n.translate('xpack.canvas.uis.views.shape.args.maintainAspectLabel', {
      defaultMessage: 'Use a fixed ratio'
    }),
    getMaintainAspectHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.shape.args.maintainAspectHelpLabel', {
      defaultMessage: `Enable to maintain aspect ratio`
    }),
    getShapeDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.shape.args.shapeTitle', {
      defaultMessage: 'Select shape'
    })
  },
  Table: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.tableTitle', {
      defaultMessage: 'Table style'
    }),
    getHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.tableLabel', {
      defaultMessage: 'Set styling for a Table element'
    }),
    getPaginateDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.table.args.paginateTitle', {
      defaultMessage: 'Pagination'
    }),
    getPaginateToggleSwitch: () => _i18n.i18n.translate('xpack.canvas.uis.views.table.args.paginateToggleSwitch', {
      defaultMessage: 'Show pagination controls'
    }),
    getPaginateHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.table.args.paginateLabel', {
      defaultMessage: 'Show or hide pagination controls. If disabled only the first page will be shown'
    }),
    getPerPageDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.table.args.perPageTitle', {
      defaultMessage: 'Rows'
    }),
    getPerPageHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.table.args.perPageLabel', {
      defaultMessage: 'Number of rows to display per table page'
    }),
    getShowHeaderDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.table.args.showHeaderTitle', {
      defaultMessage: 'Header'
    }),
    getShowHeaderToggleSwitch: () => _i18n.i18n.translate('xpack.canvas.uis.views.table.args.showHeaderToggleSwitch', {
      defaultMessage: 'Show the header row'
    }),
    getShowHeaderHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.table.args.showHeaderLabel', {
      defaultMessage: 'Show or hide the header row with titles for each column'
    })
  },
  Timefilter: {
    getColumnConfirm: () => _i18n.i18n.translate('xpack.canvas.uis.views.timefilter.args.columnConfirmButtonLabel', {
      defaultMessage: 'Set'
    }),
    getColumnDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.timefilter.args.columnTitle', {
      defaultMessage: 'Column'
    }),
    getColumnHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.timefilter.args.columnLabel', {
      defaultMessage: 'Column to which selected time is applied'
    }),
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.timefilterTitle', {
      defaultMessage: 'Time filter'
    }),
    getFilterGroupDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.timefilter.args.filterGroupTitle', {
      defaultMessage: 'Filter group'
    }),
    getFilterGroupHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.timefilter.args.filterGroupLabel', {
      defaultMessage: "Apply the selected group name to an element's filters function to target this filter"
    })
  },
  Tagcloud: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloudTitle', {
      defaultMessage: 'Tag Cloud'
    }),
    getScaleColumnDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.scaleDisplayName', {
      defaultMessage: 'Scale'
    }),
    getScaleColumnHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.scaleHelp', {
      defaultMessage: 'Scale to determine font size of a word'
    }),
    getScaleLinear: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.scaleLinearLabel', {
      defaultMessage: 'Linear'
    }),
    getScaleLog: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.scaleLogLabel', {
      defaultMessage: 'Log'
    }),
    getScaleSquareRoot: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.scaleSquareRootLabel', {
      defaultMessage: 'Square root'
    }),
    getOrientationColumnDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.orientationDisplayName', {
      defaultMessage: 'Orientation'
    }),
    getOrientationColumnHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.orientationHelp', {
      defaultMessage: 'Orientation of words inside tagcloud'
    }),
    getOrientationSingle: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.orientationSingleLabel', {
      defaultMessage: 'Single'
    }),
    getOrientationRightAngled: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.orientationRightAngledLabel', {
      defaultMessage: 'Right angled'
    }),
    getOrientationMultiple: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.orientationMultipleLabel', {
      defaultMessage: 'Multiple'
    }),
    getMinFontHeightColumnDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.minFontHeightDisplayName', {
      defaultMessage: 'Minimum font height'
    }),
    getMinFontHeightColumnHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.minFontHeightHelp', {
      defaultMessage: 'Minimum height of the element font'
    }),
    getMaxFontHeightColumnDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.maxFontHeightDisplayName', {
      defaultMessage: 'Maximum font height'
    }),
    getMaxFontHeightColumnHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.maxFontHeightHelp', {
      defaultMessage: 'Maximum height of the element font'
    }),
    getShowLabelColumnDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.showLabelDisplayName', {
      defaultMessage: 'Show label'
    }),
    getShowLabelColumnHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.showLabelHelp', {
      defaultMessage: 'Show label of the chart'
    }),
    getMetricColumnDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.metricDisplayName', {
      defaultMessage: 'Metric'
    }),
    getMetricColumnHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.metricHelp', {
      defaultMessage: 'Metric dimension configuration'
    }),
    getBucketColumnDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.bucketDisplayName', {
      defaultMessage: 'Bucket'
    }),
    getBucketColumnHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.tagcloud.args.bucketHelp', {
      defaultMessage: 'Bucket dimension configuration'
    })
  },
  MetricVis: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.metricVisTitle', {
      defaultMessage: 'Metric Vis'
    }),
    getMetricColumnDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.metricVis.args.metricDisplayName', {
      defaultMessage: 'Metric'
    }),
    getMetricColumnHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.metricVis.args.metricHelp', {
      defaultMessage: 'Metric dimension configuration'
    }),
    getBucketColumnDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.metricVis.args.bucketDisplayName', {
      defaultMessage: 'Bucket'
    }),
    getBucketColumnHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.metricVis.args.bucketHelp', {
      defaultMessage: 'Bucket dimension configuration'
    }),
    getFontColumnDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.metricVis.args.fontDisplayName', {
      defaultMessage: 'Font'
    }),
    getFontColumnHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.metricVis.args.fontHelp', {
      defaultMessage: 'Metric font configuration'
    }),
    getPercentageModeColumnDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.metricVis.args.percentageModeDisplayName', {
      defaultMessage: 'Enable percentage mode'
    }),
    getPercentageModeColumnHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.metricVis.args.percentageModeHelp', {
      defaultMessage: 'Shows metric in percentage mode.'
    }),
    getShowLabelsColumnDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.metricVis.args.showLabelsDisplayName', {
      defaultMessage: 'Show metric labels'
    }),
    getShowLabelsColumnHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.metricVis.args.showLabelsHelp', {
      defaultMessage: 'Shows labels under the metric values.'
    }),
    getColorModeColumnDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.metricVis.args.colorModeDisplayName', {
      defaultMessage: 'Metric color mode'
    }),
    getColorModeColumnHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.metricVis.args.colorModeHelp', {
      defaultMessage: 'Which part of metric to fill with color.'
    }),
    getColorModeNoneOption: () => _i18n.i18n.translate('xpack.canvas.uis.views.metricVis.args.colorMode.noneOption', {
      defaultMessage: 'None'
    }),
    getColorModeLabelOption: () => _i18n.i18n.translate('xpack.canvas.uis.views.metricVis.args.colorMode.labelsOption', {
      defaultMessage: 'Labels'
    }),
    getColorModeBackgroundOption: () => _i18n.i18n.translate('xpack.canvas.uis.views.metricVis.args.colorMode.backgroundOption', {
      defaultMessage: 'Background'
    })
  },
  Heatmap: {
    getDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmapTitle', {
      defaultMessage: 'Heatmap Visualization'
    }),
    getXAccessorDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.xAccessorDisplayName', {
      defaultMessage: 'X-axis'
    }),
    getXAccessorHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.xAccessorHelp', {
      defaultMessage: 'The name of the x axis column or the corresponding dimension'
    }),
    getYAccessorDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.yAccessorDisplayName', {
      defaultMessage: 'Y-axis'
    }),
    getYAccessorHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.yAccessorHelp', {
      defaultMessage: 'The name of the y axis column or the corresponding dimension'
    }),
    getValueAccessorDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.valueAccessorDisplayName', {
      defaultMessage: 'Value'
    }),
    getValueAccessorHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.valueAccessorHelp', {
      defaultMessage: 'The name of the value column or the corresponding dimension'
    }),
    getLegendHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.legendHelp', {
      defaultMessage: "Configure the heatmap chart's legend"
    }),
    getLegendDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.legendDisplayName', {
      defaultMessage: 'Heatmap legend'
    }),
    getGridConfigHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.gridConfigHelp', {
      defaultMessage: 'Configure the heatmap layout'
    }),
    getGridConfigDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.gridConfigDisplayName', {
      defaultMessage: 'Heatmap layout configuration'
    }),
    getSplitRowAccessorDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.splitRowAccessorDisplayName', {
      defaultMessage: 'Split row'
    }),
    getSplitRowAccessorHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.plitRowAccessorHelp', {
      defaultMessage: 'The id of the split row or the corresponding dimension'
    }),
    getSplitColumnAccessorDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.splitColumnAccessorDisplayName', {
      defaultMessage: 'Split column'
    }),
    getSplitColumnAccessorHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.splitColumnAccessorHelp', {
      defaultMessage: 'The id of the split column or the corresponding dimension'
    }),
    getShowTooltipDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.showTooltipDisplayName', {
      defaultMessage: 'Show tooltip'
    }),
    getShowTooltipHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.showTooltipHelp', {
      defaultMessage: 'Show tooltip on hover'
    }),
    getHighlightInHoverDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.highlightInHoverDisplayName', {
      defaultMessage: 'Hightlight on hover'
    }),
    getHighlightInHoverHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.highlightInHoverHelp', {
      defaultMessage: 'When this is enabled, it highlights the ranges of the same color on legend hover'
    }),
    getLastRangeIsRightOpenDisplayName: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.lastRangeIsRightOpenDisplayName', {
      defaultMessage: 'Last range is right open'
    }),
    getLastRangeIsRightOpenHelp: () => _i18n.i18n.translate('xpack.canvas.uis.views.heatmap.args.lastRangeIsRightOpenHelp', {
      defaultMessage: 'If is set to true, the last range value will be right open'
    })
  }
};
exports.ViewStrings = ViewStrings;