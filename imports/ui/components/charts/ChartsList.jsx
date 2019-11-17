import React from 'react';
import Charts from '../../../api/charts/charts_collection.js';
import ChartsSidebar from './ChartsSidebar.jsx';
import ChartTable from './ChartTable.jsx';
import { default as momentUtil } from 'moment';
import moment from 'moment-timezone';
import { Metamorph } from 'react-metamorph';
import useSubscribe from '../../hooks/useSubscribe';

function ChartsList({ latestCharts }) {
  let state = useSubscribe({
    latestCharts: []
  }, function (fxn) {
    return Meteor.subscribe('chartsLimited',
      { limit: 5, sort: { chartDate: -1, title: 1 } }, { onReady: function() {
        fxn({ latestCharts: Charts.find({},
          { limit: 2, sort: { chartDate: -1, title: 1 } }).fetch() })
      } })
  });

  function dateFmt(date) {
    return momentUtil(moment(date, 'Pacific/Honolulu')).format('MMMM DD, YYYY');
  }

  if (state.latestCharts)
    return [
      <Metamorph title="Charts - KTUH FM Honolulu | Radio for the People"
        description="KTUH Charts" image='https://ktuh.org/img/ktuh-logo.jpg' />,
      <h2 className='general__header' key='header-title'>Charts</h2>,
      <div className='playlist-list__latest' key='playlist-list-conent'>
        {latestCharts.map(({ title, chartDate, tracks, _id, slug }) =>
          [
            <h3 className='playlist__show-name' key={_id}>
              <a href={`/charts/${slug}`}>
                {`${title} - ${dateFmt(chartDate)}`}
              </a>
            </h3>,
            <ChartTable tracks={tracks} key={`${_id} tracks`}/>
          ])}
      </div>,
      <ChartsSidebar key="chart-sidebar" />
    ];
  else return null;
}

export default ChartsList;
