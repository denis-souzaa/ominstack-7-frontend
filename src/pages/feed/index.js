/* eslint-disable react-hooks/exhaustive-deps */
import React, { Component } from 'react';
import io from 'socket.io-client';
import api from '../../services/api';

import more from '../../assets/more.svg';
import like from '../../assets/like.svg';
import comment from '../../assets/comment.svg';
import send from '../../assets/send.svg';

import { Container, Post, UserInfoContainer, UserInfo, Place, Footer, Actions } from './styles';

class Feed extends Component {
	state = {
		posts: []
	};

	async componentDidMount() {
		
		const response = await api.get('posts');
		this.setState({ posts: response.data });
		
		this.registerToSocket();
	}

	registerToSocket = () => {
		const socket = io('http://localhost:3003');

		socket.on('post', newPost => {
			this.setState({posts: [newPost, ...this.state.posts]});
		});

		socket.on('like', likedPost => {
			this.setState({posts:this.state.posts.map(post => (post._id === likedPost._id ? likedPost : post))});
		});
	};

	handleLike = id => {
		api.post(`/posts/${id}/like`);
	};

	render() {
		return (
			<Container>
				{(this.state.posts || []).map(post => (
					<Post key={post._id}>
						<UserInfoContainer>
							<UserInfo>
								<span>{post.author}</span>
								<Place>{post.place} </Place>
							</UserInfo>
							<img src={more} alt="Mais" />
						</UserInfoContainer>
						<img src={`http://localhost:3003/files/${post.image}`} alt="" />
						<Footer>
							<Actions>
								<button type="button" onClick={() => this.handleLike(post._id)}>
									<img src={like} alt="like" />
								</button>
								<img src={comment} alt="comment" />
								<img src={send} alt="send" />
							</Actions>
							<strong>{post.likes} curtidas</strong>
							<p>
								{post.description}
								<span>{post.hashtags}</span>
							</p>
						</Footer>
					</Post>
				))}
			</Container>
		);
	}
}

export default Feed;
