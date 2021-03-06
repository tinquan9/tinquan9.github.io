import { getBrandInfo } from "actions/SiteWrapperAction";
import EmptyPageContent from "components/Placeholder/EmptyPageContent";
import * as React from "react";
import { connect } from "react-redux";
import { Page, Form, Button, Grid, Card } from "tabler-react";
import { apiGet } from "util/ApiUtil";

class SettingPage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = { isFetching: false, fullKeywords: null, defaultKeywords: [], addedKeywords: [], keywords: [], locations: null, isSuccess: true }
    }
    componentDidMount() {
        //const subBranding = this.props && this.props.siteWrapperReducer && this.props.siteWrapperReducer.subBranding && this.props.siteWrapperReducer.subBranding || undefined;
        // if(!subBranding) {
        const { dispatch } = this.props;
        dispatch(getBrandInfo());
        //}

        this.reload();
    }

    async reload() {


        this.setState({ ...this.state, isFetching: true });
        const fullKeywordsRes = await apiGet("/info/fullKeywords");
        const locationsRes = await apiGet("/info/locations");
        const fullKeywords = fullKeywordsRes.data;
        const locations = locationsRes.data;

        const defaultKeywords = [];
        const addedKeywords = [];
        let keywords = [];
        if (fullKeywords && fullKeywords.initial_keywords && fullKeywords.related_keywords && fullKeywords.added_keywords && fullKeywords.keywords) {
            keywords = fullKeywords.keywords;
            fullKeywords.added_keywords.forEach(kw => {
                addedKeywords.push({ name: kw, disableable: true, removeable: true, disabled: !keywords.includes(kw) })
            })

            fullKeywords.initial_keywords.forEach(kw => {
                defaultKeywords.push({ name: kw, disableable: false, removeable: false, disabled: false });
            });

            fullKeywords.related_keywords.forEach(kw => {
                addedKeywords.push({ name: kw, disableable: true, removeable: false, disabled: !keywords.includes(kw) });
            })
        }

        this.setState({ ...this.state, isFetching: false, isSuccess: true, defaultKeywords, addedKeywords, keywords })
    }

    render() {
        const subBranding = this.props && this.props.siteWrapperReducer && this.props.siteWrapperReducer.subBranding && this.props.siteWrapperReducer.subBranding || "";

        return (
            this.state.isFetching ?
                (<EmptyPageContent isFetching={this.state.isFetching} />)
                :
                (<Page.Content title="Thi???t l???p">
                    <Page.Card title="?????a ph????ng">
                        <Form.Group label="T??n hi???n th???">
                            <Grid.Row >
                                <Grid.Col lg={4} md={6} width={12}>

                                    <Form.InputGroup>
                                        <Form.Input
                                            disabled
                                            name="location-name"
                                            value={subBranding}
                                        />
                                    </Form.InputGroup>
                                </Grid.Col>

                            </Grid.Row>

                        </Form.Group>
                        <Form.Group label="Chi ti???t ????n v??? h??nh ch??nh">
                            <Grid.Row>
                                <Grid.Col lg={4} md={6} width={12} className="py-2"><Form.InputGroup>
                                    <Form.InputGroupPrepend>
                                        <Form.InputGroupText>T???nh</Form.InputGroupText>
                                    </Form.InputGroupPrepend>
                                    <Form.Select>
                                        <option>Th??nh Ph??? H??? Ch?? Minh</option>
                                    </Form.Select>
                                </Form.InputGroup></Grid.Col>
                                <Grid.Col lg={4} md={6} width={12} className="py-2"><Form.InputGroup>
                                    <Form.InputGroupPrepend>
                                        <Form.InputGroupText>Qu???n/Huy???n</Form.InputGroupText>
                                    </Form.InputGroupPrepend>
                                    <Form.Select>
                                        <option>{subBranding}</option>
                                    </Form.Select>
                                </Form.InputGroup></Grid.Col>
                                <Grid.Col lg={4} md={12} className="py-2">
                                    <Button color="primary" className="ml-auto">L??u l???i</Button>
                                </Grid.Col>
                            </Grid.Row>

                        </Form.Group>
                    </Page.Card>
                    <Page.Card title="T??? kh??a">
                        <Form.Group label="M???c ?????nh">
                            <Form.SelectGroup pills canSelectMultiple className="py-4">
                                {this.state.defaultKeywords && this.state.defaultKeywords.map(kw =>
                                    <Form.SelectGroupItem
                                        name="default-keyword"
                                        label={kw.name}
                                        value={kw.name}
                                        checked={!kw.disabled}
                                    />)}
                            </Form.SelectGroup>
                        </Form.Group>
                        <Form.Group label="Li??n quan ho???c ???????c th??m v??o">
                            <Form.SelectGroup pills canSelectMultiple className="py-4">
                                {this.state.addedKeywords && this.state.addedKeywords.map(kw =>
                                    <Form.SelectGroupItem
                                        name="default-keyword"
                                        label={kw.name + (!kw.removeable ? " ?? " : "")}
                                        value={kw.name}
                                        checked={!kw.disabled}
                                    />)}
                            </Form.SelectGroup>
                            <div className="py-4">
                                <Button color="primary" className="ml-auto">L??u l???i</Button>
                            </div>
                        </Form.Group>
                    </Page.Card>
                    <Page.Card title="Ngu???n tin t???c">
                        <Form.Group label="Danh s??ch h???n ch???">
                            <Form.SelectGroup pills canSelectMultiple className="py-4">
                                <Form.SelectGroupItem
                                    name="language"
                                    label="B??o C???n Th??"
                                    value="HTML"
                                />
                                <Form.SelectGroupItem
                                    name="language"
                                    label="B??o ?????ng Nai"
                                    value="CSS"
                                />
                                <Form.SelectGroupItem
                                    name="language"
                                    label="B??o Ph??p Lu???t Vi???t Nam"
                                    value="PHP"
                                />

                                <Form.SelectGroupItem
                                    name="language"
                                    label="vnexpress.net"
                                    value="C++"

                                />
                            </Form.SelectGroup>
                            <div className="py-4">
                                <Button color="primary" className="ml-auto">L??u l???i</Button>
                            </div>
                        </Form.Group>
                    </Page.Card>
                    <Page.Card title="Tri???n khai (Deploy)">
                        <Form.Group label="Thay ?????i s??? ???????c t??? ?????ng tri???n khai sau m???t kho???ng th???i gian ch???. B???n c??ng c?? th??? ti???n h??nh tri???n khai ngay l???p t???c.">
                            <Button color="primary" className="ml-auto my-5">Tri???n khai ngay</Button>
                        </Form.Group>
                    </Page.Card>
                </Page.Content>))
    }
}

function mapStateToProps({ authReducer, siteWrapperReducer }) {
    return {
        authReducer,
        siteWrapperReducer
    }
}

export const SettingContainer = connect(
    mapStateToProps
)(SettingPage);