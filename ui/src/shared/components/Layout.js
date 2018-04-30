import React, {Component} from 'react'
import PropTypes from 'prop-types'
import WidgetCell from 'shared/components/WidgetCell'
import LayoutCell from 'shared/components/LayoutCell'
import RefreshingGraph from 'shared/components/RefreshingGraph'
import {buildQueriesForLayouts} from 'utils/buildQueriesForLayouts'
import {IS_STATIC_LEGEND} from 'src/shared/constants'

import _ from 'lodash'

import {colorsStringSchema} from 'shared/schemas'
import {ErrorHandling} from 'src/shared/decorators/errors'

const getSource = (cell, source, sources, defaultSource) => {
  const s = _.get(cell, ['queries', '0', 'source'], null)
  if (!s) {
    return source
  }

  return sources.find(src => src.links.self === s) || defaultSource
}

@ErrorHandling
class LayoutState extends Component {
  state = {
    celldata: [],
  }

  grabDataForDownload = celldata => {
    this.setState({celldata})
  }

  render() {
    return (
      <Layout
        {...this.props}
        {...this.state}
        grabDataForDownload={this.grabDataForDownload}
      />
    )
  }
}

const Layout = (
  {
    host,
    cell,
    cell: {
      h,
      axes,
      type,
      colors,
      legend,
      timeFormat,
      fieldOptions,
      tableOptions,
      decimalPlaces,
    },
    source,
    sources,
    onZoom,
    celldata,
    templates,
    timeRange,
    isEditable,
    isDragging,
    onEditCell,
    onCloneCell,
    autoRefresh,
    manualRefresh,
    onDeleteCell,
    resizeCoords,
    onCancelEditCell,
    onStopAddAnnotation,
    onSummonOverlayTechnologies,
    grabDataForDownload,
  },
  {source: defaultSource}
) => (
  <LayoutCell
    cell={cell}
    celldata={celldata}
    isEditable={isEditable}
    onEditCell={onEditCell}
    onCloneCell={onCloneCell}
    onDeleteCell={onDeleteCell}
    onCancelEditCell={onCancelEditCell}
    onSummonOverlayTechnologies={onSummonOverlayTechnologies}
  >
    {cell.isWidget ? (
      <WidgetCell cell={cell} timeRange={timeRange} source={source} />
    ) : (
      <RefreshingGraph
        colors={colors}
        inView={cell.inView}
        axes={axes}
        type={type}
        isDragging={isDragging}
        tableOptions={tableOptions}
        fieldOptions={fieldOptions}
        timeFormat={timeFormat}
        decimalPlaces={decimalPlaces}
        staticLegend={IS_STATIC_LEGEND(legend)}
        cellHeight={h}
        onZoom={onZoom}
        sources={sources}
        timeRange={timeRange}
        templates={templates}
        autoRefresh={autoRefresh}
        manualRefresh={manualRefresh}
        onStopAddAnnotation={onStopAddAnnotation}
        grabDataForDownload={grabDataForDownload}
        resizeCoords={resizeCoords}
        queries={buildQueriesForLayouts(
          cell,
          getSource(cell, source, sources, defaultSource),
          timeRange,
          host
        )}
      />
    )}
  </LayoutCell>
)

const {arrayOf, bool, func, number, shape, string} = PropTypes

Layout.contextTypes = {
  source: shape(),
}

const propTypes = {
  isDragging: bool,
  autoRefresh: number.isRequired,
  manualRefresh: number,
  timeRange: shape({
    lower: string.isRequired,
  }),
  cell: shape({
    // isWidget cells will not have queries
    isWidget: bool,
    queries: arrayOf(
      shape({
        label: string,
        text: string,
        query: string,
      }).isRequired
    ),
    x: number.isRequired,
    y: number.isRequired,
    w: number.isRequired,
    h: number.isRequired,
    i: string.isRequired,
    name: string.isRequired,
    type: string.isRequired,
    colors: colorsStringSchema,
    tableOptions: shape({
      verticalTimeAxis: bool.isRequired,
      sortBy: shape({
        internalName: string.isRequired,
        displayName: string.isRequired,
        visible: bool.isRequired,
      }).isRequired,
      wrapping: string.isRequired,
      fixFirstColumn: bool.isRequired,
    }),
    timeFormat: string.isRequired,
    decimalPlaces: shape({
      isEnforced: bool.isRequired,
      digits: number.isRequired,
    }).isRequired,
    fieldOptions: arrayOf(
      shape({
        internalName: string.isRequired,
        displayName: string.isRequired,
        visible: bool.isRequired,
      }).isRequired
    ),
  }).isRequired,
  templates: arrayOf(shape()),
  host: string,
  source: shape({
    links: shape({
      proxy: string.isRequired,
    }).isRequired,
  }).isRequired,
  onPositionChange: func,
  onEditCell: func,
  onDeleteCell: func,
  onCloneCell: func,
  onSummonOverlayTechnologies: func,
  isStatusPage: bool,
  isEditable: bool,
  onCancelEditCell: func,
  resizeCoords: shape(),
  onZoom: func,
  sources: arrayOf(shape()),
}

LayoutState.propTypes = {...propTypes}
Layout.propTypes = {
  ...propTypes,
  grabDataForDownload: func,
  celldata: arrayOf(shape()),
}

export default LayoutState
