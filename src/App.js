import React, { Component } from 'react';
import Login from './components/Login';
import Spotify from 'spotify-web-api-js';
import './App.css';

const spotifyWebApi = new Spotify();

export default class App extends Component {

    constructor(props) {
        super(props);
        const params = this.getHashParams();
        this.state = {
            loggedIn: params.access_token ? true : false,
            recievedResponse: false,
            nowPlaying: {
                name: "Not Checked",
                image: ""
            }
        }
        if (params.access_token) {
            spotifyWebApi.setAccessToken(params.access_token);
        } 
    }
kwme
    getMusicImage = () => {
        return (
            <div>
                <img 
                    src={this.state.nowPlaying.image} 
                    alt="now-playing-artist"
                    style={{width: 400}}
                />             
            </div>
        )
    }

    getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ((e = r.exec(q))) {
           hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    getNowPlaying = () => {
        spotifyWebApi.getMyCurrentPlaybackState()
            .then((response) => {
                if (response) {
                    this.setState({
                        recievedResponse: true,
                        nowPlaying: {
                            name: response.item.name,
                            image: response.item.album.images[0].url
                        }
                    });
                } else {
                    this.setState({
                        nowPlaying: {
                            name: "Nothing currently playing!",
                            image: ""
                        }
                    })
                }
            })
    }

    render() {
        return (
            <div className="App">
                {!this.state.loggedIn ? <Login /> : '' }                 
                <div>Now Playing : {(this.state.nowPlaying.name !== '') ? this.state.nowPlaying.name : "Nothing is playing"}</div>
                {this.state.recievedResponse ? this.getMusicImage() : ''}
                <button onClick={() => this.getNowPlaying()}>Check Now Playing</button>
            </div>
        );

    }
}
