/* eslint-disable no-duplicate-case */
import React, { Component } from 'react'
import _ from 'lodash'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MsbText from './MsbText'

class MsbIcon extends Component {
  render() {
    const { style = [], size, color, name } = this.props
    let propStyle = style
    if (!_.isArray(propStyle)) {
      propStyle = [propStyle]
    }
    const styles = [
      { fontFamily: 'icomoon', backgroundColor: 'transparent' },
      size ? { fontSize: size } : {},
      color ? { color } : {},
    ].concat(propStyle)

    const stylesUpdate = [
      { fontFamily: 'icomoonupdate', backgroundColor: 'transparent' },
      size ? { fontSize: size } : {},
      color ? { color } : {},
    ].concat(propStyle)

    const stylesKyc = [
      { fontFamily: 'icomoonkyc', backgroundColor: 'transparent' },
      size ? { fontSize: size } : {},
      color ? { color } : {},
    ].concat(propStyle)

    const stylesUpdate2 = [
      { fontFamily: 'iconupdate2', backgroundColor: 'transparent' },
      size ? { fontSize: size } : {},
      color ? { color } : {},
    ].concat(propStyle)

    const stylesSetting = [
      { fontFamily: 'icomoonsetting', backgroundColor: 'transparent' },
      size ? { fontSize: size } : {},
      color ? { color } : {},
    ].concat(propStyle)

    const stylesHome = [
      { fontFamily: 'icomoonhome', backgroundColor: 'transparent' },
      size ? { fontSize: size } : {},
      color ? { color } : {},
    ].concat(propStyle)

    const stylesAccount = [
      { fontFamily: 'icomoonaccount', backgroundColor: 'transparent' },
      size ? { fontSize: size } : {},
      color ? { color } : {},
    ].concat(propStyle)

    switch (name) {
      case 'icon-circle-check':
        return <MsbText style={styles}>&#xe948;</MsbText>
      case 'icon-show':
        return <MsbText style={styles}>&#xe93e;</MsbText>
      case 'icon-247':
        return <MsbText style={styles}>&#xe941;</MsbText>
      case 'icon-avatar':
        return <MsbText style={styles}>&#xe904;</MsbText>
      case 'icon-check':
        return <MsbText style={styles}>&#xe91e;</MsbText>
      case 'icon-close':
        return <MsbText style={styles}>&#xe91f;</MsbText>
      case 'icon-hoidap':
        return <MsbText style={styles}>&#xe92b;</MsbText>
      case 'icon-search':
        return <MsbText style={styles}>&#xe93d;</MsbText>
      case 'icon-save':
        return <MsbText style={styles}>&#xe940;</MsbText>
      case 'icon-email':
        return <MsbText style={styles}>&#xe903;</MsbText>
      case 'icon-hotline':
        return <MsbText style={styles}>&#xe902;</MsbText>
      case 'icon-notification':
        return <MsbText style={styles}>&#xe93c;</MsbText>
      case 'icon-baohiem':
        return <MsbText style={styles}>&#xe900;</MsbText>
      case 'icon-chuyenkhoan':
        return <MsbText style={styles}>&#xe913;</MsbText>
      case 'icon-close':
        return <MsbText style={styles}>&#xe902;</MsbText>
      case 'icon-contact':
        return <MsbText style={styles}>&#xe905;</MsbText>
      case 'icon-didong':
        return <MsbText style={styles}>&#xe914;</MsbText>
      case 'icon-dtcodinh':
        return <MsbText style={styles}>&#xe907;</MsbText>
      case 'icon-change-pin':
        return <MsbText style={styles}>&#xe908;</MsbText>
      case 'icon-tattoan':
        return <MsbText style={styles}>&#xe909;</MsbText>
      case 'icon-chuyentien':
        return <MsbText style={styles}>&#xe90a;</MsbText>
      case 'icon-dropdown':
        return <MsbText style={styles}>&#xe90b;</MsbText>
      case 'icon-back':
        return <MsbText style={styles}>&#xe90c;</MsbText>
      case 'icon-dv-the':
        return <MsbText style={styles}>&#xe912;</MsbText>
      case 'icon-home':
        return <MsbText style={styles}>&#xe943;</MsbText>
      case 'icon-loyaty':
        return <MsbText style={styles}>&#xe944;</MsbText>
      case 'icon-menu-account':
        return <MsbText style={styles}>&#xe947;</MsbText>
      case 'icon-qr':
        return <MsbText style={styles}>&#xe916;</MsbText>
      case 'icon-setting':
        return <MsbText style={styles}>&#xe945;</MsbText>
      case 'icon-softtoken':
        return <MsbText style={styles}>&#xe919;</MsbText>
      case 'icon-tietkiem':
        return <MsbText style={styles}>&#xe91c;</MsbText>
      case 'icon-up':
        return <MsbText style={styles}>&#xe919;</MsbText>
      // case 'icon-hoadon':
      //   return <MsbText style={styles}>&#xe91a;</MsbText>
      case 'icon-khoa':
        return <MsbText style={styles}>&#xe91c;</MsbText>
      case 'icon-info':
        return <MsbText style={styles}>&#xe91f;</MsbText>
      case 'icon-internet':
        return <MsbText style={styles}>&#xe920;</MsbText>
      case 'icon-khachsan':
        return <MsbText style={styles}>&#xe921;</MsbText>
      case 'icon-thanhtoan':
        return <MsbText style={styles}>&#xe922;</MsbText>
      case 'icon-atm':
        return <MsbText style={styles}>&#xe925;</MsbText>
      case 'icon-more':
        return <MsbText style={styles}>&#xe926;</MsbText>
      case 'icon-note':
        return <MsbText style={styles}>&#xe927;</MsbText>
      case 'icon-lichsu':
        return <MsbText style={styles}>&#xe928;</MsbText>
      case 'icon-redeem':
        return <MsbText style={styles}>&#xe929;</MsbText>
      case 'icon-check':
        return <MsbText style={styles}>&#xe92a;</MsbText>
      case 'icon-ve-tauxe':
        return <MsbText style={styles}>&#xe92d;</MsbText>
      case 'icon-tt-hoadon':
        return <MsbText style={styles}>&#xe92e;</MsbText>
      case 'icon-product-hoadon':
        return <MsbText style={styles}>&#xe92f;</MsbText>
      case 'icon-thue':
        return <MsbText style={styles}>&#xe930;</MsbText>
      case 'icon-truyenhinh':
        return <MsbText style={styles}>&#xe931;</MsbText>
      case 'icon-detail':
        return <MsbText style={styles}>&#xe92c;</MsbText>
      case 'icon-the-tindung':
        return <MsbText style={styles}>&#xe935;</MsbText>
      case 'icon-the-thanhtoan':
        return <MsbText style={styles}>&#xe936;</MsbText>
      case 'icon-product':
        return <MsbText style={styles}>&#xe911;</MsbText>
      case 'icon-register-product':
        return <MsbText style={styles}>&#xe90c;</MsbText>
      case 'icon-biometric':
        return <MsbText style={styles}>&#xe90e;</MsbText>
      case 'icon-visibiity':
        return <MsbText style={styles}>&#xe938;</MsbText>
      case 'exchange-account':
        return <MsbText style={styles}>&#xe90e;</MsbText>

      case 'add':
        return <MsbText style={stylesUpdate}>&#xe900;</MsbText>
      case 'biometric':
        return <MsbText style={stylesUpdate}>&#xe901;</MsbText>
      case 'card':
        return <MsbText style={stylesUpdate}>&#xe902;</MsbText>
      case 'delete':
        return <MsbText style={stylesUpdate}>&#xe903;</MsbText>
      case 'doipinthe':
        return <MsbText style={stylesUpdate}>&#xe904;</MsbText>
      case 'edit':
        return <MsbText style={stylesUpdate}>&#xe905;</MsbText>
      case 'failed':
        return <MsbText style={stylesUpdate}>&#xe906;</MsbText>
      case 'info':
        return <MsbText style={stylesUpdate}>&#xe907;</MsbText>
      case 'interbank':
        return <MsbText style={stylesUpdate}>&#xe908;</MsbText>
      case 'lichsuthe':
        return <MsbText style={stylesUpdate}>&#xe909;</MsbText>
      case 'lockthe':
        return <MsbText style={stylesUpdate}>&#xe90a;</MsbText>
      case 'more':
        return <MsbText style={stylesUpdate}>&#xe90b;</MsbText>
      case 'msb':
        return <MsbText style={stylesUpdate}>&#xe90c;</MsbText>
      case 'sendtrasoat':
        return <MsbText style={stylesUpdate}>&#xe90d;</MsbText>
      case 'thanhtoanthe':
        return <MsbText style={stylesUpdate}>&#xe90e;</MsbText>
      case 'trasoat':
        return <MsbText style={stylesUpdate}>&#xe90f;</MsbText>

      case 'napthe':
        return <MsbText style={stylesKyc}>&#xe901;</MsbText>
      case 'mathe':
        return <MsbText style={stylesKyc}>&#xe90b;</MsbText>
      case 'napgame':
        return <MsbText style={stylesKyc}>&#xe90d;</MsbText>

      case 'inbox':
        return <MsbText style={stylesKyc}>&#xe900;</MsbText>
      case 'chondichvu':
        return <MsbText style={stylesKyc}>&#xe902;</MsbText>
      case 'codinh':
        return <MsbText style={stylesKyc}>&#xe903;</MsbText>
      case 'dien':
        return <MsbText style={stylesKyc}>&#xe904;</MsbText>
      case 'dientu':
        return <MsbText style={stylesKyc}>&#xe905;</MsbText>
      case 'khachsan':
        return <MsbText style={stylesKyc}>&#xe906;</MsbText>
      case 'hocphi':
        return <MsbText style={stylesKyc}>&#xe907;</MsbText>
      case 'internet':
        return <MsbText style={stylesKyc}>&#xe908;</MsbText>
      case 'nuoc':
        return <MsbText style={stylesKyc}>&#xe909;</MsbText>
      case 'ttoan':
        return <MsbText style={stylesKyc}>&#xe90a;</MsbText>
      case 'truyenhinh':
        return <MsbText style={stylesKyc}>&#xe90c;</MsbText>

      // icon moon update 2
      case 'doi_ten':
        return <MsbText style={stylesUpdate2}>&#xe900;</MsbText>
      case 'thanh_toan':
        return <MsbText style={stylesUpdate2}>&#xe901;</MsbText>
      case 'khoa_the':
        return <MsbText style={stylesUpdate2}>&#xe902;</MsbText>
      case 'lich_su':
        return <MsbText style={stylesUpdate2}>&#xe903;</MsbText>
      case 'thanh_toan2':
        return <MsbText style={stylesUpdate2}>&#xe904;</MsbText>
      case 'doi_qua':
        return <MsbText style={stylesUpdate2}>&#xe905;</MsbText>
      case 'nap_tien':
        return <MsbText style={stylesUpdate2}>&#xe906;</MsbText>
      case 'mo_tiet_kiem':
        return <MsbText style={stylesUpdate2}>&#xe907;</MsbText>
      case 'chuyen_khoan':
        return <MsbText style={stylesUpdate2}>&#xe908;</MsbText>

      // icon moon update 2
      case 'setting_biometric':
        return <MsbText style={stylesSetting}>&#xe900;</MsbText>
      case 'setting_change_account':
        return <MsbText style={stylesSetting}>&#xe901;</MsbText>
      case 'setting_change_limit':
        return <MsbText style={stylesSetting}>&#xe902;</MsbText>
      case 'setting_change_pass':
        return <MsbText style={stylesSetting}>&#xe903;</MsbText>
      case 'setting_change_pin':
        return <MsbText style={stylesSetting}>&#xe904;</MsbText>
      case 'setting_employee':
        return <MsbText style={stylesSetting}>&#xe905;</MsbText>
      case 'setting_language':
        return <MsbText style={stylesSetting}>&#xe906;</MsbText>
      case 'setting_pin':
        return <MsbText style={stylesSetting}>&#xe907;</MsbText>
      case 'setting_softtoken':
        return <MsbText style={stylesSetting}>&#xe908;</MsbText>

      // icon moonhome
      case 'home_softtoken':
        return <MsbText style={stylesHome}>&#xe900;</MsbText>
      case 'home_qr':
        return <MsbText style={stylesHome}>&#xe901;</MsbText>
      case 'home_the':
        return <MsbText style={stylesHome}>&#xe902;</MsbText>
      case 'home_tietkiem':
        return <MsbText style={stylesHome}>&#xe903;</MsbText>
      case 'home_naptien':
        return <MsbText style={stylesHome}>&#xe904;</MsbText>
      case 'home_thanhtoan':
        return <MsbText style={stylesHome}>&#xe905;</MsbText>
      case 'home_chuyenkhoan':
        return <MsbText style={stylesHome}>&#xe906;</MsbText>
      case 'home_247':
        return <MsbText style={stylesHome}>&#xe907;</MsbText>

      // icon account
      case 'account_doiqua':
        return <MsbText style={stylesAccount}>&#xe910;</MsbText>
      case 'account_guigop':
        return <MsbText style={stylesAccount}>&#xe911;</MsbText>
      case 'account_hoantien':
        return <MsbText style={stylesAccount}>&#xe912;</MsbText>
      case 'account_down':
        return <MsbText style={stylesAccount}>&#xe90f;</MsbText>
      case 'account_face':
        return <MsbText style={stylesAccount}>&#xe90a;</MsbText>
      case 'account_chitiet':
        return <MsbText style={stylesAccount}>&#xe900;</MsbText>
      case 'account_chuyenkhoan':
        return <MsbText style={stylesAccount}>&#xe901;</MsbText>
      case 'account_dvthe':
        return <MsbText style={stylesAccount}>&#xe902;</MsbText>
      case 'account_naptien':
        return <MsbText style={stylesAccount}>&#xe903;</MsbText>
      case 'account_taikhoan':
        return <MsbText style={stylesAccount}>&#xe904;</MsbText>
      case 'account_thanhtoan':
        return <MsbText style={stylesAccount}>&#xe905;</MsbText>
      case 'account_tietkiem':
        return <MsbText style={stylesAccount}>&#xe906;</MsbText>
      case 'account_khoanvay':
        return <MsbText style={stylesAccount}>&#xe907;</MsbText>
      case 'account_khoathe':
        return <MsbText style={stylesAccount}>&#xe908;</MsbText>
      case 'account_lichsu':
        return <MsbText style={stylesAccount}>&#xe909;</MsbText>
      case 'account_doiten':
        return <MsbText style={stylesAccount}>&#xe90b;</MsbText>
      case 'account_tattoan':
        return <MsbText style={stylesAccount}>&#xe90c;</MsbText>
      case 'account_tietkiem2':
        return <MsbText style={stylesAccount}>&#xe90d;</MsbText>
      case 'account_thanhtoan2':
        return <MsbText style={stylesAccount}>&#xe90e;</MsbText>
      default:
        return <FontAwesomeIcon name={name} style={[styles, { fontFamily: 'FontAwesome' }]} />
    }
  }
}

export default MsbIcon
