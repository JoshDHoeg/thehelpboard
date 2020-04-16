import React, { Component } from 'react';
import { compose } from 'recompose';
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from '../../utilities/Session';
import { withFirebase } from '../../utilities/Firebase';
const ProjectListPage = () => (
  <div>
    <h1>See All Available Projects</h1>
    <p>Use the form below to create a new project.</p>
    <Projects />
  </div>
);
class ProjectsBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      projects: [],
      limit: 10,
    };
  }

  componentDidMount() {
    this.onListenForProjects();
  }
  
  onListenForProjects() {
    this.setState({ loading: true });
  
  this.props.firebase.projects()
    .orderByChild('createdAt')
    .limitToLast(this.state.limit)
    .on('value', snapshot => {
      const projectObject = snapshot.val();
      if (projectObject) {
        const projectList = Object.keys(projectObject).map(key => ({
          ...projectObject[key],
          uid: key,
        }));
        this.setState({
          projects: projectList,
          loading: false,
        });
      } else {
        this.setState({ projects: null, loading: false });
      }
    });
  }


  componentWillUnmount() {
    this.props.firebase.projects().off();
  }

  onNextPage = () => {
    this.setState(
      state => ({ limit: state.limit + 5 }),
      this.onListenForprojects,
    );
  };
  
  render() {
    const { title, description, price, projects, loading } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {!loading && projects && (
              <button type="button" onClick={this.onNextPage}>
                More
              </button>
            )}
            {loading && <div>Loading ...</div>}
            {projects ? (
              <ProjectList 
                authUser={authUser}
                projects={projects}
                onEditProject={this.onEditProject}
                onRemoveProject={this.onRemoveProject}
              />
            ) : (
              <div>There are no projects ...</div>
            )}
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const ProjectList = ({
  authUser,
  projects,
  onEditProject,
  onRemoveProject,
}) => (
  <ul>
    {projects.map(project => (
      <ProjectItem
        authUser={authUser}  
        key={project.uid}
        project={project}
        onEditProject={onEditProject}
        onRemoveProject={onRemoveProject}
      />
    ))}
  </ul>
);

class ProjectItem extends Component {
  constructor(props) {
   super(props);
   this.state = {
     editMode: false,
     editText: this.props.project.text,
   };
  }
  
  render() {
    const { authUser, project, onRemoveProject } = this.props;
    const { editMode, editText } = this.state;
    return (
      <li>
          <span>
            <strong>{project.userId}</strong> {project.text}
          </span>
        
        {authUser.uid === project.userId && (
          <span>
              <button onClick={this.onToggleEditMode}>Edit</button>
          </span>
        )}
      </li>
    );
  }
}

const Projects = withFirebase(ProjectsBase);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(ProjectListPage);