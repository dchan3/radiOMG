import React from 'react';
import PlaylistSidebar from './PlaylistSidebar.jsx';
import PlaylistTable from './PlaylistTable.jsx';
import { Metamorph } from 'react-metamorph';
import { usePlaylistViewContext } from './PlaylistViewContext';

function PlaylistPage() {
  let { playlistData, playlist, showInfo, showStr, header } =
    usePlaylistViewContext();

  if (playlist) {
    return [
      <Metamorph title={`${showStr} - KTUH FM Honolulu | Radio for the People`}
        description={showStr} image={showInfo.thumbnail ||
          'https://ktuh.org/img/ktuh-logo.png'} />,
      <h2 className='general__header'>
        {header}
      </h2>,
      <div className='playlist__link'>
        <a href='/playlists' className='back-to'>← Back to Playlists</a>
      </div>,
      <div className='playlist__content'>
        {showInfo && showInfo !== 'not found'
          ? <a href={`/shows/${showInfo.slug}`}>
            <img className='playlist__show-image' src={(showInfo.thumbnail ||
            (showInfo.featuredImage && showInfo.featuredImage.url) :
            'https://ktuh.org/img/ktuh-logo.jpg')} />
          </a> : null}
        <PlaylistTable tracks={playlistData} onPage={true}/>
      </div>,
      <PlaylistSidebar />];
  }
  else return null;
}

export default PlaylistPage;
