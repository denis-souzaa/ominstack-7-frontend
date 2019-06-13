import React, { useState } from 'react';
import api from '../../services/api';

import { Container, Field, Button } from './styles';

const New = props => {
	const [post, setPost] = useState({
		image: null,
		author: '',
		place: '',
		description: '',
		hashtags: ''
	});

	const handleSubmit = async e => {
		e.preventDefault();

		const data = new FormData();

		data.append('author', post.author);
		data.append('place', post.place);
		data.append('description', post.description);
		data.append('hashtags', post.hashtags);
		data.append('image', post.image);

		await api.post('posts', data);

		props.history.push('/');
	};
	const handleImageChange = e => {
		setPost({
			...post,
			image: e.target.files[0]
		});
	};
	const handleChange = e => {
		setPost({
			...post,
			[e.target.name]: e.target.value
		});
	};

	return (
		<Container onSubmit={handleSubmit}>
			<Field type="file" onChange={handleImageChange} />
			<Field type="text" placeholder="Autor do post" onChange={handleChange} value={post.author} name="author" />

			<Field type="text" placeholder="Lugar do post" onChange={handleChange} value={post.place} name="place" />

			<Field
				type="text"
				placeholder="Descrição do post"
				onChange={handleChange}
				value={post.description}
				name="description"
			/>
			<Field
				type="text"
				placeholder="Hashtags do post"
				onChange={handleChange}
				value={post.hashtags}
				name="hashtags"
			/>

			<Button type="submit">Enviar</Button>
		</Container>
	);
};

export default New;
