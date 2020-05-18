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
                artist: "",
                albumn: "",
                image: ""
            }
        }
        if (params.access_token) {
            spotifyWebApi.setAccessToken(params.access_token);
        } 
    }

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
                            artist: response.item.album.artists[0].name,
                            albumn: response.item.album.name,
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
                <h1>Streamwise for Spotify <i className="fab fa-spotify spotify-icon"></i></h1>
                <hr />
                {!this.state.loggedIn ? <Login /> : '' }                 
                {(this.state.recievedResponse) ? <div>Now Playing - {(this.state.nowPlaying.name !== '') ? this.state.nowPlaying.name : "Nothing is playing"}</div> : 'Nothing is Playing'}
                {(this.state.recievedResponse) ? <div>By - {(this.state.nowPlaying.artist !== '') ? this.state.nowPlaying.artist : "Nothing is playing"}</div> : ''}
                {(this.state.recievedResponse) ? <div>Album - {(this.state.nowPlaying.albumn !== '') ? this.state.nowPlaying.albumn : "Nothing is playing"}</div> : ''}
                {this.state.recievedResponse ? this.getMusicImage() : ''}
                <div>
                    <button onClick={() => this.getNowPlaying()}>Now Playing</button>
                </div>
            </div>
        );

    }
}
