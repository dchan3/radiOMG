import React, { Component } from 'react';
import Charts from '../../../api/charts/charts_collection.js';
import ChartsSidebar from './ChartsSidebar.jsx';
import ChartTable from './ChartTable.jsx';
import { withTracker } from 'meteor/react-meteor-data';
import { moment as momentUtil } from 'meteor/momentjs:moment';
import moment from 'moment-timezone';

class ChartsPage extends Component {
  dateFmt(date) {
    return momentUtil(moment(date, 'Pacific/Honolulu')).format('MMMM DD, YYYY');
  }

  render() {
    return [
      <h1 className='general__header' key='header-title'>
        {this.props.chart.title + ' - ' +
          dateFmt(this.props.chart.chartDate)}</h1>,
      <div className='chart__link' key='charts-link'>
        <a href='/charts' className='back-to'>← Back to Charts</a>
      </div>,
      <div className='playlist-list__latest' key='playlist-content'>
        {this.props.chart.tracks.length > 0 &&
          <ChartTable tracks={this.props.chart.tracks} /> || null}
      </div>,
      <ChartsSidebar key="chart-sidebar" />
    ];
  }
}

export default withTracker(() => {
  var slug = FlowRouter.getParam('slug'),
    s1 = Meteor.subscribe('singleChart', slug);

  return {
    ready: s1.ready(),
    chart: Charts.findOne({ slug: slug })
  }
})(ChartsPage);
