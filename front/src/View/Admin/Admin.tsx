import React, {ChangeEvent, ReactNode} from 'react';
import Request from '../../API/Request';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import {ReactComponent as Loader} from '../../img/loader.svg';
import plusIcon from '../../img/plus-icon.png';
import Input from '../General/Input';
import InputArea from '../General/InputArea';
import DropBox from '../General/DropBox';
import '../../css/Admin.css';
import CourseSheets from '../Lobby/CourseSheets';
import Users from './Users';

interface AdminState {
    id: number,
    isAdmin: string,
    currentTab: string,
    currentLabel: string,
    currentDescription: string,
    currentLogo: File | null,
    newLabel: string,
    newDescription: string,
    newLogo: File | null,
    courseSheets: [],
    newCourseSheetTitle: string,
    newCourseSheetDescription: string,
    newCourseSheetDocument: File | null,
    users: [],
    newUserEmail: string,
    private: string,
}

class Admin extends React.Component<any, AdminState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            id: this.props.location.pathname.split(/\//)[2],
            isAdmin: '',
            currentTab: 'presentation',
            currentLabel: '',
            currentDescription: '',
            currentLogo: null,
            newLabel: '',
            newDescription: '',
            newLogo: null,
            courseSheets: [],
            newCourseSheetTitle: '',
            newCourseSheetDescription: '',
            newCourseSheetDocument: null,
            users: [],
            newUserEmail: '',
            private: '',
        }
        this.init = this.init.bind(this);
        this.init();
    }

    public init(): void {
        this.checkIfAdmin = this.checkIfAdmin.bind(this);
        this.handleLabelChange = this.handleLabelChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleLogoDrop = this.handleLogoDrop.bind(this);
        this.handleLogoChange = this.handleLogoChange.bind(this);
        this.updateLobbby = this.updateLobbby.bind(this);
        this.update = this.update.bind(this);
        this.navigateToCourseSheets = this.navigateToCourseSheets.bind(this);
        this.fillCourseSheets = this.fillCourseSheets.bind(this);
        this.removeCourseSheetFromLobby = this.removeCourseSheetFromLobby.bind(this);
        this.removeUserFromLobby = this.removeUserFromLobby.bind(this);
        this.fetchCourseSheets = this.fetchCourseSheets.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.refreshPresentation = this.refreshPresentation.bind(this);
        this.refreshCourseSheets = this.refreshCourseSheets.bind(this);
        this.handleCourseSheetDocumentDrop = this.handleCourseSheetDocumentDrop.bind(this);
        this.handleCourseSheetDocumentChange = this.handleCourseSheetDocumentChange.bind(this);
        this.handleCourseSheetTitleChange = this.handleCourseSheetTitleChange.bind(this);
        this.handleCourseSheetDescriptionChange = this.handleCourseSheetDescriptionChange.bind(this);
        this.addCourseSheet = this.addCourseSheet.bind(this);
        this.refreshUsers = this.refreshUsers.bind(this);
        this.fillUsers = this.fillUsers.bind(this);
        this.toggleWriteRights = this.toggleWriteRights.bind(this);
        this.addUser = this.addUser.bind(this);
        this.handleUserEmailChange = this.handleUserEmailChange.bind(this);
        this.refreshVisibility = this.refreshVisibility.bind(this);
        this.updateVisibility = this.updateVisibility.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
        this.checkVisibilityBox = this.checkVisibilityBox.bind(this);
    }

    public componentDidMount(): void {
        this.refreshPresentation();
        this.refreshCourseSheets();
        this.refreshUsers();
    }

    public checkIfAdmin(data: any): void {
        if (undefined === data['message']) {
            this.setState({isAdmin: 'true'});
            this.setState({currentLabel: data[0]['label_lobby']});
            this.setState({currentDescription: data[0]['description']});
        } else {
            this.setState({isAdmin: 'false'});
        }
    }

    public fillCourseSheets(data: any): void {
        if (undefined === data['message']) {
            this.setState({courseSheets: data});
        } else {
            this.setState({courseSheets: []});
        }
    }

    public fillUsers(data: any): void {
        if (undefined === data['message']) {
            this.setState({users: data});
        } else {
            this.setState({users: []});
        }
    }

    public updateVisibility(data: any): void {
        if (undefined === data['message']) {
            '1' === data[0]['private'] ? this.setState({private: 'true'}) : this.setState({private: 'false'});
        }
    }

    public refreshVisibility(): void {
        new Request(
            '/lobby/visibility/' + this.state.id,
            'POST',
            'json',
            {token: localStorage.getItem('token')},
            this.updateVisibility
        );
    }

    public handleLabelChange(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({newLabel: event.target.value});
    }

    public handleCourseSheetTitleChange(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({newCourseSheetTitle: event.target.value});
    }

    public handleDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>): void {
        this.setState({newDescription: event.target.value});
    }

    public handleCourseSheetDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>): void {
        this.setState({newCourseSheetDescription: event.target.value});
    }

    public handleLogoDrop(event: React.DragEvent<HTMLDivElement>): void {
        event.preventDefault();
        this.setState({newLogo: event.dataTransfer.files[0]});
    }

    public handleLogoChange(event: ChangeEvent<HTMLInputElement>): void {
        // @ts-ignore
        this.setState({newLogo: event.target.files[0]});
    }

    public handleCourseSheetDocumentDrop(event: React.DragEvent<HTMLDivElement>): void {
        event.preventDefault();
        this.setState({newCourseSheetDocument: event.dataTransfer.files[0]});
        console.log(this.state.newCourseSheetDocument);
    }

    public handleCourseSheetDocumentChange(event: ChangeEvent<HTMLInputElement>): void {
        // @ts-ignore
        this.setState({newCourseSheetDocument: event.target.files[0]});
        console.log(this.state.newCourseSheetDocument);
    }

    public update(data: any): void {
        if (undefined !== data['message_label']) {
            this.setState({currentLabel: this.state.newLabel});
        }
        if (undefined !== data['message_description']) {
            this.setState({currentDescription: this.state.newDescription});
        }
        if (undefined !== data['message_logo']) {
            this.setState({currentLogo: this.state.newLogo});
        }
    }

    public navigateToCourseSheets(event: React.MouseEvent<HTMLLIElement, MouseEvent>): void {
        event.preventDefault();
        let target: any = event.target;
        for (let li of target.parentElement.parentElement.children) {
            li.firstElementChild.className = 'nav-link custom-tab';
        }
        target.className = target.className + ' custom-tab-active';
        this.setState({currentTab: target.attributes.href.value});
    }

    public updateLobbby(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        let formData = new FormData();
        // @ts-ignore
        formData.append('token', localStorage.getItem('token'));
        if ('' !== this.state.newLabel) {
            formData.append('label', this.state.newLabel);
        }
        if ('' !== this.state.newDescription) {
            formData.append('description', this.state.newDescription);
        }
        if (null !== this.state.newLogo) {
            formData.append('file', this.state.newLogo);
            new Request('/lobby/update/' + this.state.id, 'POST', this.state.newLogo.type, formData, this.update);
        } else {
            new Request('/lobby/update/' + this.state.id, 'POST', '', formData, this.update);
        }
    }

    public addCourseSheet(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        let formData = new FormData();
        // @ts-ignore
        formData.append('token', localStorage.getItem('token'));
        console.log(this.state.newCourseSheetTitle);
        console.log(this.state.newCourseSheetDescription);
        console.log(this.state.newCourseSheetDocument);
        if (
            '' !== this.state.newCourseSheetTitle &&
            '' !== this.state.newCourseSheetDescription &&
            null !== this.state.newCourseSheetDocument
        ) {
            formData.append('title', this.state.newCourseSheetTitle);
            formData.append('description', this.state.newCourseSheetDescription);
            formData.append('file', this.state.newCourseSheetDocument);
            new Request('/lobby/newCourseSheet/' + this.state.id, 'POST', this.state.newCourseSheetDocument.type, formData, this.refreshCourseSheets);
        }
    }

    public refreshPresentation(): void {
        new Request('/lobby/consult/' + this.state.id, 'POST', 'json', {token: localStorage.getItem('token')}, this.checkIfAdmin);
    }

    public refreshCourseSheets(): void {
        new Request('/lobby/coursesheets/' + this.state.id, 'POST', 'json', {token: localStorage.getItem('token')}, this.fillCourseSheets);
    }

    public refreshUsers(): void {
        new Request('/lobby/users/' + this.state.id, 'POST', 'json', {token: localStorage.getItem('token')}, this.fillUsers);
    }

    public fetchCourseSheets(data: any): void {
        if (data['message'].includes('successfully')) {
            this.refreshCourseSheets();
        }
    }

    public fetchUsers(data: any): void {
        if (data['message'].includes('successfully')) {
            this.refreshUsers();
        }
    }

    public removeCourseSheetFromLobby(event: React.MouseEvent<HTMLImageElement, MouseEvent>): void {
        let removeButton: any = event.target;
        new Request('/lobby/deleteCourseSheet/' + this.state.id,
            'POST',
            'json',
            {
                token: localStorage.getItem('token'),
                id: removeButton.id.split(/-/)[2]
            }, this.fetchCourseSheets);
    }

    public removeUserFromLobby(event: React.MouseEvent<HTMLImageElement, MouseEvent>): void {
        let removeButton: any = event.target;
        new Request('/lobby/removeUser/' + this.state.id,
            'POST',
            'json',
            {
                token: localStorage.getItem('token'),
                id: removeButton.id.split(/-/)[2]
            }, this.fetchUsers);
    }

    public toggleWriteRights(event: React.ChangeEvent<HTMLInputElement>): void {
        let action: string = true === event.target.checked ?
            'addWriteRight/' :
            'removeWriteRight/';
        new Request('/lobby/' + action + this.state.id,
            'POST',
            'json',
            {
                token: localStorage.getItem('token'),
                id: event.target.id,
            },
            this.fetchUsers);
    }

    public addUser(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        new Request('/lobby/addUser/' + this.state.id, 'POST', 'json', {
            token: localStorage.getItem('token'),
            email: this.state.newUserEmail
        }, this.refreshUsers);
    }

    public handleUserEmailChange(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({newUserEmail: event.target.value});
    }

    public toggleVisibility(event: ChangeEvent<HTMLInputElement>): void {
        let action: string;

        action = 'true' === this.state.private ?
            'makePublic/' : 'makePrivate/';
        new Request(
            '/lobby/' + action + this.state.id,
            'POST',
            'json',
            {token: localStorage.getItem('token')},
            this.refreshVisibility
        );
    }

    public checkVisibilityBox(event: React.MouseEvent<HTMLHeadElement, MouseEvent>): void {
        console.log(event.target);
    }

    public render(): ReactNode {
        return (
            <Router>
                <Switch>
                    <Route exact path={this.props.path}>
                        <h3>Veuillez choisir un lobby</h3>
                    </Route>
                    <Route path={this.props.location.pathname}>
                        {() => {
                            if ('true' === this.state.isAdmin) {
                                let tab;
                                switch (this.state.currentTab) {
                                    case 'presentation':
                                        tab = (
                                            <div className={'container-fluid col-lg-8 col-md-12 col-sm-12 col-xs-12'}>
                                                <h2>Informations visibles par les visiteurs</h2>
                                                <Input id={'labelInput'}
                                                       inputType={'text'}
                                                       placeholder={'Titre du lobby (n\'en mets pas un trop long)'}
                                                       checked={false}
                                                       className={'mt-5'} onChange={this.handleLabelChange}/>
                                                <div className={'row mt-5'}>
                                                    <InputArea id={'descriptionInput'}
                                                               placeholder={'Nouvelle description du lobby\nRacontes-y ce que tu veux, du moment que ça reste dans le thème de ton lobby'}
                                                               className={'col-lg-6 col-md-6 col-sm-6 col-xs-6'}
                                                               textAreaClassName={''}
                                                               rows={5}
                                                               onChange={this.handleDescriptionChange}
                                                               disabled={false}
                                                    />
                                                    <InputArea id={'descriptionInput'}
                                                               placeholder={'Description actuelle du lobby\n' + this.state.currentDescription}
                                                               className={'col-lg-6 col-md-6 col-sm-6 col-xs-6'}
                                                               textAreaClassName={''}
                                                               rows={5}
                                                               onChange={this.handleDescriptionChange}
                                                               disabled={true}
                                                    />
                                                </div>
                                                <DropBox id={'logoInput'}
                                                         className={'mt-4'}
                                                         label={'Glisse un logo par ici !'}
                                                         accept={'image/*'}
                                                         backgroundClassName={'mt-4'}
                                                         handleFileDrop={this.handleLogoDrop}
                                                         handleFileChange={this.handleLogoChange}/>
                                                <SubmitButton
                                                    text={'Mettre à jour le lobby'}
                                                    onClick={this.updateLobbby}
                                                    className={'mt-5'}/>
                                            </div>
                                        );
                                        break;

                                    case 'coursesheets':
                                        tab = (
                                            <div className={'container-fluid  col-lg-8 col-md-12 col-sm-12 col-xs-12'}>
                                                <h2>Informations visibles par les visiteurs</h2>
                                                <div className={'row mt-5'}>
                                                    <div
                                                        className={'col-lg-4 col-md-4 col-sm-4 col-xs-4 pr-lg-0 pl-sm-4'}>
                                                        <div className={'centered-80'}>
                                                            <Input id={'titleInput'} inputType={'text'}
                                                                   placeholder={'Titre'}
                                                                   className={'no-mb'}
                                                                   checked={false}
                                                                   onChange={this.handleCourseSheetTitleChange}/>
                                                            <DropBox id={'courseSheetInput'}
                                                                     className={'text-sm-left'}
                                                                     backgroundClassName={'mt-1'}
                                                                     label={'Glisse une fiche par ici !'}
                                                                     accept={'.docx,.pdf,.html,.htm,.odp,txt,md'}
                                                                     handleFileDrop={this.handleCourseSheetDocumentDrop}
                                                                     handleFileChange={this.handleCourseSheetDocumentChange}/>
                                                        </div>
                                                    </div>
                                                    <div className={'col-lg-8 col-md-8 col-sm-8 col-xs-8 pl-lg-0'}>
                                                        <div className={'row container-fluid'}>
                                                            <InputArea id={'descriptionInput'}
                                                                       placeholder={'Description de la fiche\nFais-en un bref résumé permettant de savoir à quoi s\'attendre en la lisant'}
                                                                       className={'col-lg-12 col-md-12 col-sm-12 col-xs-12 course-sheet-textarea'}
                                                                       textAreaClassName={'course-sheet-textarea'}
                                                                       rows={6}
                                                                       onChange={this.handleCourseSheetDescriptionChange}
                                                                       disabled={false}
                                                            />
                                                        </div>
                                                        <div className={'row container-fluid'}>
                                                            <SubmitButton
                                                                text={'Une nouvelle fiche ? Ajoute-la !'}
                                                                onClick={this.addCourseSheet}
                                                                className={'col-sm-12 container-fluid add-coursesheet-button mt-5'}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={'row mt-5'}>
                                                    <CourseSheets
                                                        id={this.state.id.toString()}
                                                        courseSheets={this.state.courseSheets}
                                                        className={'col-lg-12 col-sm-12 mt-lg-3'}
                                                        activeRemoveButton={true}
                                                        delete={this.removeCourseSheetFromLobby}
                                                    />
                                                </div>
                                            </div>
                                        );
                                        break;

                                    case 'rights':
                                        tab = (
                                            <div className={'container-fluid  col-lg-8 col-md-12 col-sm-12 col-xs-12'}>
                                                <h2>Utilisateurs autorisés à consulter le lobby</h2>
                                                <div className={'row'}>
                                                    <Users
                                                        id={this.state.id.toString()}
                                                        users={this.state.users}
                                                        className={'col-lg-12 col-sm-12 mt-lg-3 mt-md-0 mt-sm-0 mt-xs-0'}
                                                        toggleWriteRights={this.toggleWriteRights}
                                                        delete={this.removeUserFromLobby}
                                                    />
                                                </div>
                                                <div className={'container col-lg-8 col-md-8 col-sm-10 col-xs-12 mt-5'}>
                                                    <div className={'row'}>
                                                        <div className={'col-12 pl-0 add-usr-button'}>
                                                            <Input
                                                                id={'friendInput'}
                                                                inputType={'email'}
                                                                placeholder={'Un ami veut voir ton lobby ? Alors saisis son adresse email ici'}
                                                                checked={false}
                                                                className={'add-usr-input'}
                                                                onChange={this.handleUserEmailChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={'row'}>
                                                        <div className={'col-12 pl-0 '}>
                                                            <SubmitButton
                                                                text={'Ca y est ? Alors c\'est parti, ajoute-le !'}
                                                                onClick={this.addUser}
                                                                className={'mt-0 col-12 add-usr-button'}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={'row col-12 pt-5'}>
                                                    <div className={'col-1 pt-2 pl-0 pr-0'}>
                                                        <Input
                                                            id={'visibilitInput'}
                                                            inputType={'checkbox'}
                                                            checked={'true' === this.state.private ? true : false}
                                                            placeholder={''}
                                                            className={'user-rights-checkbox'}
                                                            onChange={this.toggleVisibility}
                                                        />
                                                    </div>
                                                    <h4
                                                        className={'col-11 pl-0 pt-1 text-left lobby-write-right-label'}
                                                        onClick={this.checkVisibilityBox}
                                                    >
                                                        Lobby privé (seules les personnes autorisées pourront le
                                                        consulter
                                                    </h4>
                                                </div>
                                            </div>
                                        );
                                        break;

                                    default:
                                        tab = <h2>Informations visibles par les visiteurs</h2>
                                        break;
                                }
                                return (
                                    <section className={'content row container-fluid'}>
                                        <div className={'row col col-lg-12 col-md-12 col-sm-12 col-xs-12'}>
                                            <div className={'admin-header'}>
                                                <h1>{this.state.currentLabel}</h1>
                                                <nav>
                                                    <ul className="nav nav-tabs custom-tab-nav">
                                                        <li className="nav-item" onClick={this.navigateToCourseSheets}>
                                                            <a className="nav-link custom-tab-active custom-tab"
                                                               href={'presentation'}>Description</a>
                                                        </li>
                                                        <li className="nav-item" onClick={this.navigateToCourseSheets}>
                                                            <a className="nav-link custom-tab"
                                                               href={'coursesheets'}>Fiches</a>
                                                        </li>
                                                        <li className="nav-item" onClick={this.navigateToCourseSheets}>
                                                            <a className="nav-link custom-tab"
                                                               href={'rights'}>Droits</a>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                        {tab}
                                    </section>
                                );
                            } else if ('false' === this.state.isAdmin) {
                                return (
                                    <div>
                                        <h1>Vous n'êtes pas administrateur de ce lobby</h1>
                                    </div>
                                );
                            } else {
                                return <div className={'mt-5'}><Loader/></div>
                            }
                        }}
                    </Route>
                </Switch>
            </Router>
        );
    }
}

class SubmitButton extends React.Component<{ text: string, onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void, className: string }, {}> {
    public render() {
        return (
            <button className={'btn btn-default btn-transparent rounded-1 ' + this.props.className}
                    onClick={this.props.onClick}><img className={'plus-icon'} src={plusIcon}
                                                      alt={'Plus Icon'}/>{this.props.text}
            </button>
        )
    }
}

export default Admin;