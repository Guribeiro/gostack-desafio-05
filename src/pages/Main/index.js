import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

// eslint-disable-next-line import/named
import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            repo: '',
            repositories: [],
            loading: false,
        };
    }

    componentDidMount() {
        const repositories = localStorage.getItem('@repositores');

        if (repositories) {
            this.setState({ repositories: JSON.parse(repositories) });
        }
    }

    componentDidUpdate(_, prevState) {
        const { repositories } = this.state;
        if (prevState.repositories !== repositories) {
            localStorage.setItem('@repositores', JSON.stringify(repositories));
        }
    }

    handleChange = (e) => {
        this.setState({ repo: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        this.setState({ loading: true });

        const { repo, repositories } = this.state;

        const response = await api.get(`/repos/${repo}`);

        const { full_name } = response.data;

        const data = {
            name: full_name,
        };

        this.setState({
            repositories: [...repositories, data],
            repo: '',
            loading: false,
        });
    };

    render() {
        const { repo, loading, repositories } = this.state;
        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>

                <Form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Adicionar repositório"
                        value={repo}
                        onChange={this.handleChange}
                    />

                    <SubmitButton loading={loading}>
                        {loading ? (
                            <FaSpinner color="#fff" size={14} />
                        ) : (
                            <FaPlus color="#fff" size={14} />
                        )}
                    </SubmitButton>
                </Form>
                <List>
                    {repositories.map((repository) => (
                        <li key={repository.name}>
                            <span>{repository.name}</span>
                            <Link
                                to={`/repository/${encodeURIComponent(
                                    repository.name
                                )}`}
                            >
                                Detalhes
                            </Link>
                        </li>
                    ))}
                </List>
            </Container>
        );
    }
}

export default Main;
