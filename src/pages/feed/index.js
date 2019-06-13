import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import api from '../../services/api';

import more from '../../assets/more.svg';
import like from '../../assets/like.svg';
import comment from '../../assets/comment.svg';
import send from '../../assets/send.svg';

import { Container, Post, UserInfoContainer, UserInfo, Place, Footer, Actions } from './styles';

const Feed = () => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		async function loadPosts() {
			const response = await api.get('posts');
			setPosts(response.data);
		}

		function registerToSocket() {
			const socket = io('http://localhost:3003');

			socket.on('post', newPost => {
				setPosts([newPost, ...posts]);
			});

			socket.on('like', likedPost => {
				let newPost = posts.map(post => (post._id === likedPost._id ? likedPost : post));
				console.log(newPost);
				setPosts([newPost, ...posts]);
			});
		}

		loadPosts();
		registerToSocket();
	}, []);

	const handleLike = id => {
		api.post(`/posts/${id}/like`);
	};

	return (
		<Container>
			{(posts || []).map(post => (
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
							<button type="button" onClick={() => handleLike(post._id)}>
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
};

export default Feed;
