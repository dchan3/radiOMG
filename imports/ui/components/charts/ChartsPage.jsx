import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Charts from '../../../api/charts/charts_collection.js';
import ChartsSidebar from './ChartsSidebar.jsx';
import ChartTable from './ChartTable.jsx';
import { default as momentUtil } from 'moment';
import moment from 'moment-timezone';
import { Metamorph } from 'react-metamorph';
import useSubscribe from '../../hooks/useSubscribe';

function ChartsPage() {
  let state = useSubscribe({
    chart: []
  }, function (fxn) {
    let slug = FlowRouter.getParam('slug');
    return Meteor.subscribe('singleChart', {
      onReady: function() {
        fxn({
          chart: Charts.findOne({ slug })
        });
      }
    });
  });

  function dateFmt(date) {
    return momentUtil(moment(date, 'Pacific/Honolulu')).format('MMMM DD, YYYY');
  }

  if (state.chart) {
    let { title, chartDate, tracks } = state.chart,
      dateStr = dateFmt(chartDate);

    return [
      <Metamorph title={`${title} - ${dateStr
      } - KTUH FM Honolulu | Radio for the People`} description={
        `${title} - ${dateStr}`} image='https://ktuh.org/img/ktuh-logo.jpg' />,
      <h1 className='general__header' key='header-title'>
        {`${title} - ${dateStr}`}</h1>,
      <div className='chart__link' key='charts-link'>
        <a href='/charts' className='back-to'>← Back to Charts</a>
      </div>,
      <div className='playlist-list__latest' key='playlist-content'>
        {tracks.length && <ChartTable { ...{ tracks }} /> || null}
      </div>,
      <ChartsSidebar key="chart-sidebar" />
    ];
  }
  else return null;
}

export default ChartsPage;
