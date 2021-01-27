import * as React from 'react'
import { useState, Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet, View, ImageBackground, Image, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native'
import I18n from 'i18n-js'
import { ScrollView } from 'react-native-gesture-handler';
import { Helpers, Metrics, Colors, ApplicationStyles, Images } from '../../../theme'
import { Text, ConfirmButton, Radio, Topbar, Loader } from '../../../components'
import * as Navigation from '../../../navigation'
import { productOperations } from '../../../state/product'
import { Utils } from '../../../utilities'
import HTML from 'react-native-render-html';
import { IGNORED_TAGS } from 'react-native-render-html/src/HTMLUtils';
import { odSavingOperations } from '../../../state/overdraftSaving'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.small * 1.8,
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.small * 1.8,
    paddingBottom: Metrics.small,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: Metrics.normal,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  text: {
    color: Colors.white,
    fontSize: 20,
    alignSelf: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: Metrics.small,
    borderBottomWidth: 1,
    borderBottomColor: Colors.white,
    marginTop: Metrics.normal,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
    color: Colors.primary2,
  },
  line: {
    marginHorizontal: Metrics.normal,
    marginTop: Metrics.normal,
    height: 1,
    backgroundColor: Colors.line,
  },
  checkBox: {
    marginHorizontal: Metrics.normal,
    paddingVertical: Metrics.normal,
  },
  textCheckBox: {
    fontSize: 12,
    color: '#171D33',
  },
})

const CreateODConfirm = () => {
  const htmlContent = `
  <p><strong> PHỤ LỤC 03 </strong></p>
  <p><strong> BẢN ĐIỀU KHOẢN ĐIỀU KIỆN GIAO DỊCH CHUNG CHO VIỆC CẤP HẠN MỨC THẤU CHI BẰNG PHƯƠNG TIỆN ĐIỆN TỬ BẢO ĐẢM BẰNG TIỀN GỬI TIẾT KIỆM ONLINE </strong></p>
  <ul>
    <li>Giải Thích Từ Ngữ</li>
  </ul>
  <ol>
    <li><strong> MSB: </strong> là Ngân hàng Thương mại Cổ phần Hàng Hải Việt Nam.</li>
    <li><strong> Khách hàng/Người gửi tiền: </strong> Là cá nhân đăng ký mở và được MSB chấp thuận cấp hạn mức thấu chi bảo đảm bằng tiền gửi tiết kiện online trên kênh ngân hàng điện tử; đồng thời là chủ sở hữu tiền gửi tiết kiệm online mở tại MSB.</li>
    <li><strong> Thấu chi: </strong> Là dịch vụ MSB cung cấp cho khách hàng, theo đó MSB đồng ý chấp thuận cho Khách hàng chi vượt số dư Có trên tài khoản thanh toán bằng đồng Việt Nam của Khách hàng tại MSB phù hợp với các quy định của Pháp luật và MSB về hoạt động thanh toán. Khách hàng phải trả lãi và các chi phí khác (nếu có) trên số tiền thấu chi và hoàn trả tiền gốc thấu chi trong một thời hạn nhất định.</li>
    <li><strong> Hạn mức thấu chi (HMTC): </strong> Là số tiền tối đa MSB chấp thuận cho Khách hàng được phép thấu chi trong thời hạn quy định theo thỏa thuận giữa MSB và Khách hàng được thể hiện trong Bản Điều khoản điều kiện giao dịch này.</li>
    <li><strong> Phí cấp HMTC: </strong> Phí thu cho việc cấp và sử dụng HMTC (nếu có)</li>
    <li><strong> Số dư khả dụng của tài khoản thấu chi: </strong> Là số dư trên tài khoản tiền gửi thanh toán mà Khách hàng được phép sử dụng. Số dư khả dụng được xác định bằng số dư tài khoản cộng (+) HMTC trừ (-) số tiền bị phong tỏa trên tài khoản (nếu có).</li>
    <li><strong> Tài khoản thấu chi (TKTC): </strong> Là tài khoản MSB cấp cho Khách hàng khi đăng ký HMTC thành công để sử dụng vào các mục đích phù hợp theo quy định pháp luật.</li>
    <li><strong> Tiền gửi tiết kiệm online: </strong> Là tiền gửi tiết kiệm có kỳ hạn do Khách hàng thực hiện mở và đăng ký trên kênh Ngân hàng điện tử của MSB.</li>
    <li><strong> Internet Banking </strong> : Là kênh giao dịch giữa MSB với Khách hàng thông qua các trình duyệt web trên các thiết bị có kết nối với Internet.</li>
    <li><strong> OTP (One Time password): </strong> Là mật khẩu sử dụng một lần và có hiệu lực trong một khoảng thời gian nhất định, thường được sử dụng như một yếu tố thứ 2 để xác thực người dùng truy cập do hệ thống khởi tạo mật khẩu của MSB tự động phát sinh ngẫu nhiên và gửi đến thiết bị di động của Khách hàng dưới dạng tin nhắn SMS hoặc giá trị hiển thị từ thiết bị bảo mật (Token/Soft Token). Thời gian hiệu lực OTP là 3 phút nếu dưới dạng tin nhắn SMS và 2 phút với giá trị hiển thị từ thiết bị bảo mật.</li>
    <li><strong> Token: </strong> Là dụng cụ cung cấp mật khẩu, hoạt động theo phương thức tự tạo các ký tự một cách ngẫu nhiên và thay đổi theo thời gian. Token có thời hạn sử dụng và thời hạn sử dụng được ghi trên Token.</li>
    <li><strong> Soft Token: </strong> Là phần mềm cung cấp mã OTP được cài đặt trên thiết bị di động đã đăng ký với MSB và gắn duy nhất với tài khoản đăng nhập eBank. Mã OTP được sinh ngẫu nhiên theo thời gian, đồng bộ với hệ thống thanh toán trực tuyến của MSB. Khi thực hiện giao dịch thanh toán, MSB yêu cầu Khách hàng nhập mã OTP được sinh bởi Soft Token để hoàn thành giao dịch. Mỗi mã OTP có giá trị trong 1 khoảng thời gian nhất định.</li>
  </ol>
  <ul>
    <li>Nguyên Tắc Áp Dụng</li>
  </ul>
  <ol>
    <li>Bản Điều khoản điều kiện giao dịch chung cho việc cấp hạn mức thấu chi bằng phương tiện điện tử được bảo đảm bằng tiền gửi tiết kiệm online này (“ <strong> Điều khoản điều kiện giao dịch </strong> ”) điều chỉnh mối quan hệ giữa Khách hàng với MSB khi Khách hàng đề nghị mở và cấp hạn mức thấu chi bảo đảm bằng tiền gửi tiết kiệm online trên kênh ngân hàng điện tử mà không phải trực tiếp đến các điểm giao dịch của MSB để thực hiện.</li>
    <li>Bản Điều khoản điều kiện giao dịch này cùng với (i) các thông tin đề nghị về hạn mức, thời hạn, mục đích và phương thức sử dụng HMTC mà Khách hàng đã lựa chọn và gửi đến MSB thông qua hệ thống Ngân hàng điện tử và (ii) bản Điều khoản điều kiện giao dịch chung dịch vụ tài khoản thanh toán và thẻ ghi nợ [đường link] và (iii) bản Điều khoản điều kiện giao dịch chung dịch vụ ngân hàng điện tử [đường link], tạo thành một thỏa thuận hoàn chỉnh, không tách rời, có giá trị pháp lý như một bản hợp đồng/thỏa thuận cấp hạn mức thấu chi bảo đảm bằng tiền gửi tiết kiệm online trên kênh ngân hàng điện tử. Để tránh hiểu nhầm, việc nhắc đến thuật ngữ <strong> Điều khoản điều kiện giao dịch </strong> được hiểu rằng đã bao gồm tất cả các thông tin và văn kiện giao dịch được đề cập ở trên.</li>
    <li>Khách hàng hiểu và cam kết rằng các thông tin mà Khách hàng đề nghị cấp HMTC qua Internet Banking; các thông tin của Khách hàng (bao gồm cả các thông tin được Khách hàng cập nhật, chỉnh sửa) được trích xuất từ hệ thống Internet Banking là chân thực, khớp đúng và là một phần không tách rời của bản Điều khoản điều kiện giao dịch này.</li>
    <li>Khách hàng vui lòng đọc kỹ bản Điều khoản điều kiện giao dịch này, Bản Điều khoản điều kiện giao dịch chung dịch vụ tài khoản thanh toán và thẻ ghi nợ [đường link] và bản Điều khoản điều kiện giao dịch chung dịch vụ ngân hàng điện tử [đường link] trước khi xác nhận thông tin. Việc Khách hàng lựa chọn tích chọn và xác nhận ĐỒNG Ý với thông tin đăng tải trên Internet Banking được hiểu là Khách hàng đã đọc, đã được giải thích đầy đủ, chi tiết và đồng ý với nội dung bản Điều khoản điều kiện giao dịch này.</li>
    <li>Trường hợp Khách hàng không đồng ý với hoặc chưa hiểu biết, nắm rõ các nội dung hoặc không đáp ứng được các điều kiện tại bản Điều khoản điều kiện giao dịch này, vui lòng không tiếp tục truy cập và/hoặc tiếp tục thực hiện các thao tác khởi tại HMTC trên Internet Banking.</li>
    <li>Các nội dung không được quy định tại bản Điều khoản điều kiện giao dịch này thực hiện theo quy định tại các bản Điều khoản điều kiện giao dịch chung dịch vụ tài khoản thanh toán và thẻ ghi nợ và bản Điều khoản điều kiện giao dịch chung dịch vụ ngân hàng điện tử và thỏa thuận khác giữa MSB với Khách hàng (nếu có). Để tránh hiểu nhầm, trường hợp có bất kỳ nội dung mâu thuẫn nào giữa bản Điều khoản điều kiện giao dịch này với các bản điều khoản điều kiện nêu trên thì ưu tiên áp dụng nội dung của bản Điều khoản điều kiện giao dịch này.</li>
    <li>Trong quá trình sử dụng dịch vụ, Khách hàng đồng ý rằng MSB có quyền đơn phương sửa đổi, bổ sung nội dung bản Điều khoản điều kiện giao dịch này trên cơ sở phù hợp với quy định Pháp luật và MSB sẽ niêm yết công khai trên Internet Banking, website <a href="http://www.msb.com.vn"> msb.com.vn </a> và/hoặc tại các điểm giao dịch của MSB. Việc Khách hàng tiếp tục sử dụng dịch vụ sau thời điểm hiệu lực của bản Điều khoản điều kiện giao dịch đã được sửa đổi, bổ sung được hiểu là Khách hàng đã chấp thuận các sửa đổi, bổ sung đó.</li>
  </ol>
  <ul>
    <li>Điều Kiện Để Được Cấp Hạn Mức Thấu Chi Bằng Phương Tiện Điện Tử</li>
  </ul>
  <ol>
    <li>Khách hàng sử dụng tên truy cập, mật khẩu truy cập vào dịch vụ Internet Banking đã đăng ký tại MSB để đăng ký mở</li>
    <li>Tại thời điểm đề nghị mở hạn mức thấu chi Online, Khách hàng phải đảm bảo đồng thời các điều kiện sau:</li>
  </ol>
  <h3>a.       Đã mở tài khoản thanh toán và đăng ký đầy đủ dịch vụ ngân hàng điện tử tại MSB;</h3>
  <h3>b.      Khách hàng đã có tiền gửi tiết kiệm online mở tại MSB </h3>
  <h3>c.       Là công dân có quốc tịch duy nhất là Việt Nam, từ đủ 18 tuổi trở lên và có năng lực hành vi dân sự đầy đủ theo quy định pháp luật Việt Nam;</h3>
  <h3>d.      Khách hàng không thuộc đối tượng cấm hoặc hạn chế cấp tín dụng theo quy định của pháp luật và quy định nội bộ của MSB từng thời kỳ;</h3>
  <h3>e.       Khách hàng không nằm trong danh sách đen (Black-list), Watch-list, Block-list của MSB;</h3>
  <h3>f.       Khoản cấp HMTC của Khách hàng phải được đảm bảo bằng tiền gửi tiết kiệm online mở tại MSB thuộc sở hữu của Khách hàng và đang còn hiệu lực tại thời điểm cầm cố và đề nghị cấp Hạn mức thấu chi Online;</h3>
  <h3>g.      Khoản cấp HMTC cho Khách hàng nằm trong giới hạn dư nợ của Khách hàng cá nhân, bảo đảm tuân thủ quy định về giới hạn tổng dư nợ cho vay cá nhân theo quy định của MSB từng thời kỳ.</h3>
  <ol start="3">
    <li>Bằng việc tích chọn đồng ý với bản Điều khoản điều kiện giao dịch này, Khách hàng đồng ý sử dụng tiền gửi tiết kiệm online mở tại MSB (bao gồm toàn bộ gốc và lãi phát sinh) đã được lựa chọn để làm tài sản cầm cố đảm bảo cho việc cấp HMTC tại MSB.</li>
  </ol>
  <p>Kể từ thời điểm Khách hàng đăng ký thành công mở TKTC trên Internet Banking, Khách hàng chấp thuận để MSB được toàn quyền (i) phong tỏa toàn bộ gốc và lãi phát sinh của khoản tiền gửi tiết kiệm online và (ii) xử lý tài sản cầm cố là tiền gửi tiết kiệm online theo quy định tại bản Điều khoản điều kiện giao dịch này và các quy định nội bộ của MSB từng thời kỳ. Đồng thời Khách hàng hiểu rằng không được thực hiện các giao dịch liên quan đến tiền gửi tiết kiệm online cho đến khi HMTC được đóng và MSB đã giải tỏa tiền gửi tiết kiệm online này.</p>
  <h3> </h3>
  <p> </p>
  <ul>
    <li>Hạn Mức, Thời Hạn, Mục Đích Và Phương Thức Sử Dụng Hạn Mức Thấu Chi Bằng Phương Tiện Điện Tử:</li>
  </ul>
  <p>Bằng việc xác nhận đồng ý với bản Điều khoản Điều kiện giao dịch này, Khách hàng hiểu rằng MSB đồng ý cấp một HMTC cho Khách hàng với chi tiết hạn mức, thời hạn HMTC, mục đích và phương thức sử dụng HMTC theo các đề nghị mà Khách hàng đã gửi cho MSB thông qua hệ thống Ngân hàng điện tử. Các thông tin đề nghị về hạn mức, thời hạn, mục đích và phương thức sử dụng HMTC mà Khách hàng đã lựa chọn và gửi đến MSB thông qua hệ thống Ngân hàng điện tử là một phần đính kèm, không tách rời với bản Điều khoản điều kiện giao dịch này, tạo thành một một bản thỏa thuận/ hợp đồng cấp hạn mức thấu chi bảo đảm bằng tiền gửi tiết kiện online hoàn chỉnh như được quy định tại Điều 2 của bản Điều khoản điều kiện này.</p>
  <ul>
    <li>Lãi Suất Thấu Chi Và Phí, Chi Phí
      <ol>
        <li>Lãi suất thấu chi:</li>
      </ol>
    </li>
  </ul>
  <ol>
    <li>Lãi suất thấu chi trong hạn mở bằng phương tiện điện tử bảo đảm bằng tiền gửi tiết kiệm online được cố định trong suốt thời gian cấp HMTC và được MSB thông báo tới Khách hàng qua Internet Banking khi Khách hàng khai báo thông tin và đăng ký HMTC.</li>
    <li>Lãi thấu chi quá hạn:</li>
  </ol>
  <ul>
    <li>Khoản nợ gốc quá hạn phải chịu lãi suất quá hạn bằng 150% lãi suất thấu chi trong hạn đang áp dụng tại thời điểm chuyển nợ quá hạn tương ứng với thời gian chậm trả.</li>
    <li>Đối với khoản lãi tính trên nợ gốc mà đến hạn chưa trả, Khách hàng phải chịu mức lãi suất chậm trả bằng 10%/năm tính trên số dư lãi chậm trả tương ứng với thời gian chậm trả.</li>
    <li>Lãi suất quá hạn và lãi suất chậm trả là cố định, trừ trường hợp các bên có thỏa thuận khác.</li>
  </ul>
  <ol>
    <li>Phương thức tính lãi:</li>
  </ol>
  <table width="92%">
    <tbody>
      <tr>
        <td rowspan="2" width="16%">
          <p>Số tiền lãi =</p>
        </td>
        <td width="83%">
          <p>∑ ( Số dư nợ thực tế  x  số ngày duy trì số dư nợ thực tế  x  Lãi suất tính lãi)</p>
        </td>
      </tr>
      <tr>
        <td width="83%">
          <p>365</p>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Trong đó:</p>
  <ul>
    <li>Thời hạn tính lãi được xác định từ ngày mở HMTC hết ngày liền kề trước ngày đóng HMTC (tính ngày đầu, bỏ ngày cuối của thời hạn tính lãi) và thời điểm xác định số dư nợ để tính lãi là cuối mỗi ngày trong thời hạn tính lãi;</li>
    <li>Số ngày duy trì dư nợ thực tế: Là số ngày mà số dư nợ thực tế cuối mỗi ngày không thay đổi.</li>
    <li>Lãi suất tính lãi: được tính theo tỷ lệ %/năm trên cơ sở một năm là 365 ngày và được xác định là mức lãi suất thấu chi theo quy định tại điểm a) điều này;
      <ol start="2">
        <li>Phí, chi phí liên quan đến việc cấp và sử dụng HMTC (nếu có):</li>
      </ol>
    </li>
  </ul>
  <ol>
    <li>Khách hàng chịu trách nhiệm thanh toán các khoản phí liên quan đến việc MSB cấp và cho phép Khách hàng sử dụng HMCT theo quy định của MSB từng thời kỳ và sẽ thông báo cho Khách hàng khi phát sinh.</li>
    <li>Các loại phí liên quan tới dịch vụ tài khoản, thanh toán thực hiện theo biểu phí MSB công bố công khai trên website của MSB và tại các điểm giao dịch tại thời điểm nộp phí. Các khoản phí, chi phí chưa bao gồm thuế giá trị gia tăng.</li>
    <li>Trường hợp Khách hàng không thanh toán đúng hạn các loại phí, chi phí nêu trên thì phải trả lãi chậm trả bằng 20%/năm tính trên số tiền chậm trả tương ứng với thời gian chậm trả.</li>
    <li>Khách hàng có trách nhiệm thanh toán các khoản phí, chi phí phát sinh từ việc sử dụng dịch vụ của Bên thứu ba liên quan đến khoản vay (nếu có) theo yêu cầu của MSB.</li>
  </ol>
  <p> </p>
  <ul>
    <li>Chấm Dứt HMTC</li>
  </ul>
  <p>HMTC mở bằng phương tiện điện tử có thể bị đóng/chấm dứt trong các trường hợp sau:</p>
  <ol>
    <li><strong> Trường hợp chấm dứt HMTC đúng hạn: </strong></li>
    <li>Trước 30 (ba mươi) ngày tính đến thời điểm HMTC hết hạn, MSB gửi thông báo qua hệ thống tin nhắn (SMS) cho Khách hàng thông báo về ngày HMTC hết hạn.</li>
    <li>Nếu không có yêu cầu của Khách hàng, hệ thống tự động đóng HMTC của Khách hàng vào ngày chấm dứt HMTC. Khách hàng sẽ không thực hiện được bất kỳ giao dịch thấu chi nào sau ngày hết hạn HMTC.</li>
    <li>Khách hàng có trách nhiệm thanh toán toàn bộ gốc, lãi phí dịch vụ (nếu có) phát sinh từ vào ngày cuối cùng của thời hạn cấp HMTC. Trường hợp vào ngày đến hạn mà Khách hàng không thanh toán đầy đủ và đúng hạn các nghĩa vụ tài chính này, Khách hàng đồng ý rằng MSB có quyền lựa chọn một hoặc đồng thời các phương thức sau để thanh toán toàn bộ gốc, lãi, phí dịch vụ (nếu có): (i) trích tiền từ Tài khoản thanh toán của Khách hàng mở tại MSB hoặc (ii) tất toán tiền gửi tiết kiệm (được đăng ký làm Tài sản đảm bảo của HMTC) và chuyển tiền vào tài khoản thấu chi để thanh toán toàn bộ nghĩa vụ của Khách hàng.</li>
    <li><strong> Trường hợp chấm dứt HMTC trước hạn: </strong></li>
    <li>Khách hàng chủ động chấm dứt HMTC trước hạn:</li>
  </ol>
  <p>Khách hàng có thể chấm dứt HMTC trước hạn và có trách nhiệm thanh toán toàn bộ gốc, lãi, phí và chi phí phát sinh (nếu có) hoặc sử dụng chính tiền gửi tiết kiệm (được đăng ký là Tài sản đảm bảo của HMTC) để thanh toán toàn bộ gốc, lãi, phí dịch vụ này trước khi chấm dứt HMTC.</p>
  <ol>
    <li>MSB có quyền đơn phương chấm dứt HMTC trước hạn khi xảy ra một trong các trường hợp sau:</li>
  </ol>
  <ul>
    <li>Khách hàng sử dụng HMTC sai mục đích đã đăng ký với MSB theo Bản Điều khoản điều kiện giao dịch này;</li>
    <li>Khách hàng không khai báo chính xác, đầy đủ thông tin hoặc không cập nhật các thông tin liên quan đến việc vay vốn như thông tin về nhân thân, tình hình tài chính, tài sản v.v… của Khách hàng theo yêu cầu của MSB;</li>
    <li>Khách hàng vi phạm các cam kết trong Bản Điều khoản điều kiện này hoặc theo quy định của pháp luật hoặc yêu cầu của cơ quan nhà nước có thẩm quyền;</li>
    <li>Khách hàng bị chết hoặc bị tuyên bố chết; bị tuyên bố hạn chế hoặc mất năng lực hành vi dân sự; bị tuyên bố có khó khăn trong nhận thức, làm chủ hành vi, bị khởi tố, bị mất tích; bỏ trốn hoặc vắng mặt không có ký do hợp pháp tại nơi cư trú từ 03 tháng trở lên;</li>
    <li>Khách hàng vi phạm bất kỳ nghĩa vụ thanh toán nào đối với MSB liên quan đến khoản vay, bao gồm nhưng không giới hạn các nghĩa vụ trả gốc, lãi, phí, phạt, bồi thường thiệt hại, chi phí khác (nếu có);</li>
    <li>Khách hàng có bất kỳ khoản tín dụng nào tại MSB hoặc các tổ chức tín dụng bị chuyển sang nợ xấu;</li>
    <li>Theo yêu cầu của MSB tại bất kỳ thời điểm nào, khi xảy ra các sự kiện hoặc có những diễn biến mà theo đánh giá của MSB sẽ gây bất lợi, tác động tiêu cực đến khả năng trả nợ của Khách hàng cũng như khả năng thanh toán của MSB nói riêng và hệ thống Ngân hàng nói trên;</li>
    <li>Các trường hợp khác theo các thỏa thuận giữa Khách hàng và MSB (nếu có).</li>
  </ul>
  <ol>
    <li>Khi xảy ra một trong các trường hợp quy định tại Điểm (b) Khoản 2 Điều này, MSB được quyền chủ động đóng HMTC và thông báo cho Khách hàng biết lý do. Khách hàng phải hoàn trả cho MSB toàn bộ số dư nợ thấu chi (bao gồm nhưng không giới hạn là tiền gốc, tiền lãi và phí/phạt) phát sinh theo thông báo của MSB.Trường hợp không thanh toán đầy đủ và đúng hạn các nghĩa vụ tài chính này, Khách hàng đồng ý rằng MSB có quyền lựa chọn một hoặc đồng thời các phương thức được quy định tại Khoản (a), Điều này để thanh toán toàn bộ nghĩa vụ của Khách hàng.</li>
    <li>Khi thực hiện thủ tục trả nợ trước hạn, Khách hàng phải ghi rõ nội dung trả nợ trước hạn trong ủy nhiệm chi, lệnh chuyển tiền hoặc chứng từ khác.</li>
    <li>Nếu MSB nhận được tiền trả nợ trước hạn của Khách hàng trước 16h00 của ngày trả nợ trước hạn, ngày MSB nhận được tiền trả nợ trước hạn sẽ được tính là ngày trả nợ trước hạn; Nếu MSB nhận được tiền trả nợ trước hạn của Khách hàng sau 16h00 của ngày trả nợ trước hạn, ngày trả nợ trước hạn sẽ được tính là ngày hôm sau.</li>
    <li>Các khoản nợ bị thu hồi trước hạn theo thông báo của MSB được coi là khoản nợ đến hạn và MSB có quyền áp dụng các biện pháp thu hồi nợ theo thỏa thuận tại bản Điều khoản điều kiện giao dịch này và quy định của pháp luật có liên quan.</li>
  </ol>
  <ul>
    <li>Trả Nợ Gốc, Lãi Và Các Khoản Phải Trả Khác
      <ol>
        <li>Thu nợ gốc:</li>
      </ol>
    </li>
  </ul>
  <ol>
    <li>Khách hàng phải thanh toán (i) toàn bộ dư nợ gốc thấu chi còn lại vào ngày cuối cùng của thời hạn duy trì HMTC hoặc vào ngày theo thông báo của MSB gửi tới Khách hàng trong trường hợp chấm dứt HMTC trước hạn; (ii) dư nợ gốc thấu chi vượt hạn mức vào ngày theo thông báo của MSB gửi tới Khách hàng.</li>
    <li>Bằng bản Điều khoản điều kiện giao dịch này, Khách hàng đồng ý rằng:</li>
  </ol>
  <ul>
    <li>Khi có bất kỳ khoản tiền nào phát sinh ghi Có vào TKTC, hệ thống của MSB được quyền tự động thu toàn bộ/một phần dư nợ gốc đã thấu chi của Khách hàng;</li>
    <li>Đồng ý và ủy quyền không hủy ngang cho MSB tự động trích tiền từ TKTT để thu nợ gốc thấu chi khi TKTC có số dư &lt; 0 (còn dư nợ gốc thấu chi). Việc trích tiền tự động được thực hiện định kỳ 01 lần/ngày vào thời điểm cuối ngày cho đến khi số dư TKTC = 0</li>
  </ul>
  <ol start="2">
    <li>Thu lãi:
      <ol>
        <li>Căn cứ số dư trên TKTC hàng ngày, hệ thống sẽ thực hiện tính tổng số lãi phát sinh trong tháng và Khách hàng bằng bản Điều khoản điều kiện giao dịch này ủy quyền cho MSB trích nợ TKTT để thu lãi vào ngày cuối cùng của tháng. Khách hàng có thể lựa chọn phương thức trả lãi bằng cách chuyển tiền vào TKTC hoặc chuyển tiền vào TKTT để MSB tự động trích tiền thu lãi, vào ngày thu lãi.</li>
        <li>MSB được quyền thu hồi các khoản phải trả của Khách hàng đối với MSB phát sinh liên quan đến khoản cấp HMTC được quy định tại bản Điều khoản điều kiện giao dịch này theo thứ tự sau: Nợ gốc, nợ lãi, các khoản phí, các khoản phải trả khác (nếu có) và/hoặc các thứ tự thu nợ khác do MSB chủ động quyết định phù hợp với quy định pháp luật từng thời kỳ.</li>
        <li>Trường hợp Khách hàng có nhiều hơn một (01) TKTC, MSB sẽ thu nợ theo thứ tự nêu tại Điểm d Khoản này đối với lần lượt từng TKTC, theo nguyên tắc ưu tiên thu nợ trước đối với HMTC mở trước.</li>
      </ol>
    </li>
    <li>Bằng bản Điều khoản điều kiện giao dịch này, Khách hàng đồng ý rằng trường hợp Khách hàng, vì bất kỳ lý do gì, không trả được bất kỳ khoản nợ nào (bao gồm nhưng không giới hạn các khoản: nợ gốc, lãi, các khoản phí, chi phí, các khoản phạt) đầy đủ và đúng hạn, thì MSB được toàn quyền lựa chọn thực hiện một hoặc đồng thời các biện pháp dưới đây:</li>
    <li>Khấu trừ các nghĩa vụ thanh toán của MSB đối với Khách hàng phát sinh từ các giao dịch khác giữa MSB và Khách hàng (nếu có);</li>
    <li>Trích nợ bất kỳ khoản tiền gửi nào (tiền gửi tiết kiệm, tiền gửi có kỳ hạn, tiền gửi trên tài khoản thanh toán) của Khách hàng tại MSB và/hoặc tại các tổ chức tín dụng khác (nếu có) để thu nợ, bao gồm nhưng không giới hạn tiền gốc, lãi và bất kỳ lợi ích nào phát sinh từ khoản tiền gửi;</li>
    <li>Xử lý tài sản bảo đảm và áp dụng mọi biện pháp khác để thu hồi nợ theo quy định của pháp luật.</li>
    <li>Khách hàng đồng ý rằng việc áp dụng một hoặc đồng thời các biện pháp nêu tại Khoản 3 Điều này tuân theo các nguyên tắc sau:</li>
    <li>MSB được toàn quyền quyết định lựa chọn và áp dụng biện pháp phù hợp mà không phụ thuộc vào việc Khách hàng và/hoặc bất kỳ người bảo lãnh/cam kết đồng trả nợ nào (nếu có) đang trong tình trạng hoặc có nguy cơ mất khả năng thanh toán dưới bất kỳ hình thức nào hay không theo đánh giá của MSB, trừ trường hợp pháp luật có quy định khác.</li>
    <li>Các biện pháp nêu trên:</li>
  </ol>
  <ul>
    <li>có thể được MSB áp dụng vào bất kỳ thời điểm nào, cho dù các nghĩa vụ thanh toán được khấu trừ hoặc các khoản tiền gửi đến hạn hay chưa đến hạn; và</li>
    <li>có hiệu lực áp dụng tới khi Khách hàng hoàn thành tất cả các nghĩa vụ thanh toán với MSB theo quy định tại Bản điều khoản điều kiện này. MSB được toàn quyền thực hiện các biện pháp nêu trên theo quy định tại Bản điều khoản điều kiện này mà không cần bất kỳ chấp thuận nào khác của Khách hàng.</li>
  </ul>
  <ol>
    <li>Trường hợp đồng tiền của nghĩa vụ thanh toán/ khoản tiền gửi bị khấu trừ khác với đồng tiền trả nợ, MSB được toàn quyền thực hiện việc quy đổi sang đồng tiền trả nợ theo tỷ giá quy đổi do MSB xác định tại thời điểm thực hiện biện pháp khấu trừ.</li>
    <li>MSB có toàn quyền:</li>
  </ol>
  <ul>
    <li>tính toán và điều chỉnh giá trị của khoản khấu trừ tại thời điểm thực hiện khấu trừ (nếu có) phù hợp theo quy định của pháp luật;</li>
    <li>lựa chọn bất kỳ nghĩa vụ thanh toán/khoản tiền gửi nào để thực hiện khấu trừ trong trường hợp Khách hàng có nhiều nghĩa vụ thanh toán/khoản tiền gửi với MSB theo nhiều văn kiện giao dịch khác nhau;</li>
    <li>phân tách, chia nhỏ bất kỳ nghĩa vụ thanh toán/khoản tiền gửi nào của Khách hàng với MSB để thực hiện tính toán và khấu trừ theo quy định tại Bản điều khoản điều kiện này và phù hợp quy định của pháp luật.</li>
    <li>Thực hiện bất kỳ hành động nào, bao gồm nhưng không giới hạn việc phong tỏa/tạm khóa, giải tỏa/bỏ tạm khóa tài khoản tiền gửi của Khách hàng tại MSB trong phạm vi pháp luật cho phép, để thực hiện việc khấu trừ.</li>
  </ul>
  <ol start="5">
    <li>Khách hàng uỷ quyền không huỷ ngang cho MSB được thực hiện bất kỳ thủ tục cần thiết nào để yêu cầu các tổ chức tín dụng khác tất toán (nếu có) và trích một phần hoặc toàn bộ tiền gửi từ tài khoản của Khách hàng mở tại tổ chức tín dụng đó để chuyển về tài khoản của Khách hàng tại MSB để thu nợ. Số tiền còn lại sau khi MSB hoàn tất việc trích nợ sẽ được hoàn trả cho Khách hàng vào tài khoản thanh toán hoặc theo chỉ định của Khách hàng tại thời điểm hoàn trả phù hợp với quy định pháp luật.</li>
    <li>Trường hợp ngày đến hạn trả nợ gốc và/hoặc lãi trùng vào ngày nghỉ (bao gồm các ngày nghỉ hàng tuần, ngày nghỉ lễ, nghỉ tết và các ngày nghỉ khác theo quy định của pháp luật) thì ngày thanh toán gốc và/hoặc lãi chuyển sang ngày làm việc liền kề tiếp theo, tiền lãi được tính đến ngày thực tế trả nợ. Dư nợ để tính lãi là số dư cuối của ngày làm việc trước ngày đó.</li>
  </ol>
  <ul>
    <li>Cơ Cấu Lại Thời Hạn Trả Nợ</li>
  </ul>
  <h3>1.      Đến hạn trả nợ (gốc và lãi), nếu Khách hàng chưa có khả năng trả nợ, thì phải gửi Giấy đề nghị cơ cấu lại thời hạn trả nợ cho MSB chậm nhất là 10 ngày làm việc trước mỗi kỳ hạn trả nợ. Giấy đề nghị cơ cấu lại thời hạn trả nợ phải nêu rõ lý do đề nghị điều chỉnh kỳ hạn trả nợ hoặc gia hạn nợ; khả năng, thơi fhanj và nguồn trả nợ, kèm theo các tài liệu chứng minh.</h3>
  <h3>2.      Trong thời hạn 10 ngày làm việc trước ngày khoản nợ đến hạn, MSB sẽ xem xét, đánh giá khả năng trả nợ, nguồn trả nợ của Khách hàng và các yếu tố khác mà MSB cho là cần thiết và thông báo lại cho Khách hàng về:</h3>
  <ol>
    <li>Đồng ý cơ cấu lại thời hạn trả nợ cho khách hàng và ký văn bản để xác định lịch trả nợ mới;</li>
    <li>Không đồng ý cơ cấu lại thời hạn trả nợ. Trong trường hợp này, Khách hàng phải tiếp tục thực hiện nghĩa vụ trả nợ theo thời hạn đã cam kết.</li>
  </ol>
  <ul>
    <li>Chuyển Nợ Quá Hạn</li>
  </ul>
  <ol>
    <li>Một phần hoặc toàn bộ số dư nợ gốc thấu chi được chuyển sang nợ quán hạn vào ngày liền sau ngày phát sinh một hoặc một số sự kiện sau :</li>
    <li>Khách hàng không thanh toán đầy đủ toàn bộ đối với số dư nợ gốc thấu chi còn lại vào ngày cuối cùng của thời hạn duy trì HMTC ;</li>
    <li>Khách hàng không thanh toán đầy đủ toàn bộ đối với số dư nọ gốc thấu chi còn lại vào ngày theo thông báo của MSB gửi tới Khách hàng trong trường hợp chấm dứt HMTC trước hạn theo quy định tại bản Điều khoản điều kiện giao dịch này ;</li>
    <li>Khách hàng không thanh toán đầy đủ phần dư nợ gốc thấu chi vượt hạn mức vào ngày theo thông báo của MSB gửi tới Khách hàng theo quy định tại bản Điều khoản điều kiện giao dịch này.</li>
    <li>MSB sẽ thông báo về việc chuyển nợ quá hạn theo phương thức do MSB quy định trong từng thời kỳ.</li>
  </ol>
  <ul>
    <li>Quản Lý, Sử Dụng Tài Sản Cầm Cố Là Tiền Gửi Tiết Kiệm Online</li>
  </ul>
  <ol start="3">
    <li>Toàn bộ số dư tiền gửi, số tiền lãi và lợi ích vật chất khác phát sinh từ tiền gửi tiết kiệm online (sau đây gọi chung là Tài sản cầm cố) sẽ được MSB phong tỏa và chỉ được giải tỏa khi Khách hàng đã thực hiện đầy đủ nghĩa vụ với MSB hoặc nghĩa vụ được bảo đảm được thay thế bằng biện pháp/tài sản bảo đảm khác.</li>
    <li>Khách hàng không được trao đổi, tặng cho, góp vốn, chuyển nhượng tài sản cầm cố dưới mọi hình thức; không được dùng tài sản cầm cố để bảo đảm thực hiện nghĩa vụ khác khi chưa được MSB chấp thuận bằng văn bản.</li>
  </ol>
  <ul>
    <li>Xử Lý Tài Sản Cầm Cố</li>
  </ul>
  <ol>
    <li>MSB được toàn quyền lựa chọn xử lý một phần hoặc toàn bộ Tài sản cầm cố (sau đây gọi chung là xử lý Tài sản cầm cố) để thu hồi nợ (bao gồm cả thu hồi nợ trước hạn) theo quy định của Pháp luật và quy định của MSB khi xảy ra một trong những trường hợp dưới đây:</li>
    <li>Nghĩa vụ được bảo đảm theo Hợp đồng này không được thực hiện hoặc thực hiện không đúng, không đầy đủ khi đến hạn trả nợ (kể cả trường hợp phải trả nợ trước hạn theo quy định tại Hợp đồng tín dụng);</li>
    <li>Các trường hợp Khách hàng vi phạm nghĩa vụ theo Bản điều khoản điều kiện này và các cam kết tín dụng với MSB mà không khắc phục hoặc không khắc phục được trong thời hạn do MSB yêu cầu;</li>
    <li>Một phần hoặc toàn bộ Tài sản cầm cố bị mất, huỷ hoại, hư hỏng hoặc giảm sút giá trị, nhưng không được bổ sung, thay thế theo đúng yêu cầu của MSB;</li>
    <li>Một phần hoặc toàn bộ Tài sản cầm cố bị chuyển nhượng, trao đổi, tặng cho, góp vốn hoặc bị chuyển quyền sở hữu dưới bất kỳ hình thức nào;</li>
    <li>Khách hàng là cá nhân bị chết hoặc bị tuyên bố chết; bị tuyên bố hạn chế hoặc mất năng lực hành vi dân sự; bị tuyên bố có khó khăn trong nhận thức, làm chủ hành vi; bị khởi tố, bị mất tích; bỏ trốn hoặc vắng mặt không có lý do hợp pháp tại nơi cư trú từ 3 tháng trở lên; ly hôn hoặc liên quan đến các sự kiện khác gây khó khăn cho việc thu hồi nợ;</li>
    <li>Thu hồi nợ cho MSB để bảo đảm quyền ưu tiên của MSB đối với tài sản cầm cố trong trường hợp Khách hàng có nguy cơ phải thực hiện các nghĩa vụ với bên thứ ba;</li>
    <li>Các trường hợp khác do các bên thoả thuận hoặc Pháp luật quy định.</li>
    <li>Khi xử lý Tài sản cầm cố, MSB được trực tiếp tự động tất toán một phần hoặc toàn bộ Tài sản cầm cố, lĩnh tất cả các khoản tiền gốc, lãi phát sinh hoặc chuyển nhượng một phần hoặc toàn bộ Tài sản cầm cố mà không cần thêm bất kỳ sự đồng ý nào của Bên cầm cố.</li>
    <li>Tiền, giá trị thu được từ việc xử lý Tài sản cầm cố, sau khi trừ chi phí bảo quản và các chi phí khác cho MSB, sẽ được sử dụng để trả nợ cho MSB theo thứ tự ưu tiên thỏa thuận tại Hợp đồng tín dụng và theo quy định của pháp luật:</li>
    <li>Trong trường hợp giá trị của Tài sản cầm cố lớn hơn giá trị của nghĩa vụ được bảo đảm thì MSB thanh toán số tiền chênh lệch đó cho Bên cầm cố, trừ trường hợp có thỏa thuận khác.</li>
    <li>Trong trường hợp giá trị của Tài sản cầm cố thấp hơn giá trị của nghĩa vụ được bảo đảm thì Khách hàng phải tiếp tục thanh toán cho phần nghĩa vụ được bảo đảm còn lại.</li>
  </ol>
  <ul>
    <li>Quyền Và Nghĩa Vụ Của Khách Hàng</li>
  </ul>
  <ol>
    <li>Được sử dụng HMTC bằng phương tiện điện tử theo thỏa thuận với MSB tại bản Điều khoản điều kiện giao dịch này.</li>
    <li>Được thực hiện các giao dịch liên quan đến TKTC bằng phương tiện điện tử theo quy định của pháp luật và của MSB tại bản Điều khoản điều kiện giao dịch này.</li>
    <li>Khách hàng có trách nhiệm thực hiện đúng và đầy đủ bản Điều khoản điều kiện này và các hướng dẫn, yêu cầu khác của MSB hiển thị trên Internet Banking/Mobile Banking, trên website <a href="http://www.msb.com.vn"> msb.com.vn </a> , tại các điểm giao dịch của MSB (nếu có), trên các kênh giao dịch điện tử khác (nếu có) và/hoặc tại các thông báo MSB gửi thành công tới Khách hàng liên quan tới việc mở, đóng, sử dụng HMTC này.</li>
    <li>Khách hàng phải chịu trách nhiệm về tính chính xác, chân thực và hợp pháp của những thông tin cung cấp cho MSB khi thực hiện mở/đóng và các giao dịch khác liên quan đến tài khoản thấu chi này.</li>
    <li>Khách hàng có trách nhiệm thực hiện các nghĩa vụ liên quan đến bảo đảm an toàn thông tin định danh cá nhân, thông tin liên quan đến việc đăng ký Tài khoản, truy cập và sử dụng Internet Banking (bao gồm nhưng không giới hạn tên truy cập, mật khẩu truy cập, OTP và các loại mật mã giao dịch) và các thiết bị nhận OTP, các loại mật mã giao dịch (bao gồm nhưng không giới hạn như Token, Soft Token, thiết bị di động) và các nghĩa vụ bảo mật khác theo quy tại bản Điều khoản điều kiện giao dịch này.</li>
    <li>Khách hàng có trách nhiệm cung cấp, cập nhật đầy đủ và đảm bảo tính chân thực, khớp đúng, chính xác và kịp thời các thông tin theo yêu cầu của MSB khi Khách hàng mở và sử dụng HMTC trên Internet Banking. Khách hàng hoàn toàn chịu trách nhiệm trước pháp luật và miễn trừ toàn bộ trách nhiệm cho MSB đối với bất kỳ tranh chấp và/hoặc hành vi vi phạm pháp luật nào xuất ơhast từ việc Khách hàng cung cấp, cập nhật thông tin không trung thực, không khớp đúng và không chính xác hay không kịp thời, vì bất cứ lý do gì.</li>
    <li>Bằng bản Điều khoản điều kiện giao dịch này, Khách hàng chấp thuận từ bỏ mọi quyền khiếu nại, khiếu kiện của mình và miễn trừ mọi trách nhiệm và/hoặc nghĩa vụ của MSB liên quan (nếu có) đến : (i) thiệt hại của Khách hàng phát sinh do lỗi của Khách hàng, dù là vô ý hay cố ý; (ii) bất kỳ hành động cần thiết nào của MSB khi Khách hàng không thực hiện đúng và đầy đủ bản Điều khoản điều kiện giao dịch này và các hướng dẫn yêu cầu khác của MSB, bao gồm nhưng không giới hạn việc MSB từ chối các yêu cầu mở, đóng, sử dụng HMTC của Khách hàng không phù hợp với quy định tại Bản Điều khoản điều kiện giao dịch này, quy định pháp luật và quy định của MSB từng thời kỳ.</li>
    <li>Khách hàng có trách nhiệm chủ động thường xuyên, liên tục theo dõi, cập nhật nội dung bản Điều khoản điều kiện giao dịch này và các thông tin khác liên quan đến sản phẩm, dịch vụ do MSB cung cấp trên Internet Banking/Mobile Banking, website <a href="http://www.msb.com.vn"> msb.com.vn </a> và/hoặc tại các điểm giao dịch của MSB hoặc bằng các phương thức truyền thông khác. Khách hàng cũng từ bỏ mọi quyền khiếu nại, khiếu kiện đối với MSB trong trường hợp vì bất cứ lý do nào mà Khách hàng không thể cập nhật kịp thời nội dung sửa đổi, bổ sung của bản Điều khoản điều kiện giao dịch này, trừ trường hợp việc chậm trễ do lỗi của MSB.</li>
  </ol>
  <p>Việc Khách hàng tiếp tục sử dụng HMTC sau thời điểm sửa đổi, bổ sung bản Điều khoản điều kiện giao dịch này đồng nghĩa với việc Khách hàng chấp thuận với các nội dung sửa đổi, bổ sung này.</p>
  <ol start="9">
    <li>Các quyền và nghĩa vụ khác theo quy định của pháp luật và quy định tại bản Điều khoản giao dịch này và các thỏa thuận khác giữa Khách hàng và MSB (nếu có).</li>
  </ol>
  <ul>
    <li>Quyền Và Nghĩa Vụ Của MSB</li>
  </ul>
  <ol>
    <li>Được quyền từ chối việc mở, đóng HMTC hoặc các giao dịch hợp pháp khác liên quan đến HMTC nếu Khách hàng không thực hiện theo đúng các thỏa thuận với MSB tại Bản Điều khoản điều kiện giao dịch này và quy định của pháp luật.</li>
    <li>Được quyền thu phí (nếu có) theo quy định tại bản Điều khoản điều kiện giao dịch này khi Khách hàng thực hiện các giao dịch liên quan đến thấu chi bằng phương tiện điện tử.</li>
    <li>Bằng bản Điều khoản điều kiện giao dịch này, được Khách hàng chấp thuận miễn trừ mọi trách nhiệm và/hoặc nghĩa vụ của MSB liên quan (nếu có) đến thiệt hại của Khách hàng phát sinh do lỗi của Khách hàng, dù là vô ý hay cố ý, phối hợp với hoặc tạo điều kiện cho, dù là trực tiếp hay gián tiếp, bất kỳ nhân viên nào của MSB thực hiện các thủ tục giao dịch tài khoản thấu chi không phù hợp với quy định bản Điều khoản điều kiện giao dịch này, quy định pháp luật và quy định của MSB từng thời kỳ.</li>
    <li>Được quyền sửa đổi, bổ sung nội dung bản Điều khoản điều kiện giao dịch này trên cơ sở phù hợp với quy định pháp luật và MSB sẽ niêm yết công khai trên Internet Banking/Mobile Banking, website <a href="http://www.msb.com.vn"> msb.com.vn </a> và/hoặc tại các điểm giao dịch của MSB. Trường hợp không đồng ý với nội dung sửa đổi, bổ sung bản Điều khoản điều kiện giao dịch này, Khách hàng có quyền chấm dứt việc sử dụng dịch vụ sau khi đã hoàn thành các nghĩa vụ với MSB phù hợp với quy định tại bản Điều khoản điều kiện giao dịch này và thỏa thuận khác (nếu có) giữa Khách hàng và MSB.</li>
    <li>Bảo mật thông tin liên quan đến Khách hàng và các giao dịch của Khách hàng tại MSB trừ trường hợp (i) MSB buộc phải tiết lộ thông tin theo quy định của pháp luật, theo yêu cầu của cơ quan nhà nước có thẩm quyền và/hoặc (ii) theo quyết định của MSB trong các trường hợp cần thiết cung cấp cho bên thứ ba (như Trung tâm thông tin tín dụng – CIC; luật sư; bên bảo đảm; nhà thầu; bên cung cấp dịch vụ; các công ty là người có liên quan của MSB theo quy định của pháp luật và các cơ quan, tổ chức, cá nhân khác) để phục vụ hoạt động mua bán nợ, xử lý nợ, kiểm toán, tư vấn, thông tin tín dụng và/hoặc phục vụ việc MSB bán chéo sản phẩm nhằm hỗ trợ Khách hàng tiếp cận những sản phẩm dịch vụ tài chính, ngân hàng phù hợp với quy định pháp luật. Bằng việc chấp nhận bản Điều khoản điều kiện này, Khách hàng thừa nhận rằng việc cung cấp thông tin cho bên thứ ba trong các trường hợp nêu trên được thực hiện hoàn toàn vì lợi ích của Khách hàng, đồng thời chấp thuận miễn trừ cho MSB khỏi mọi trách nhiệm liên qaun đến các tranh chấp phát sinh trực tiếp hoặc gián tiếp từ việc cung cấp thông tin trên (nếu có) và/hoặc (iii) các trường hợp khác khi có văn bản chấp thuận của Khách hàng.</li>
    <li>Khách hàng chấp thuận rằng MSB không phải chịu bất kỳ trách nhiệm nào, bao gồm cả trách nhiệm thanh toán các khoản phạt, bồi thường thiệt hại, bồi hoàn hay bất kỳ chi phí liên quan nào đối với những thiệt hại, tổn thất của Khách hàng phát sinh do:</li>
    <li>Khách hàng:</li>
  </ol>
  <ul>
    <li>Vì bất cứ lý do gì không nhận dược hoặc không tiếp cận (các) thông báo đã được MSB gửi đi thành công, bao gồm nhưng không giới hạn các trường hợp do máy tính hoặc Nhà cung cấp dịch vụ của Khách hàng không đảm bảo khả năng kết nối đường truyền được ổn định, liên tục; Khách hàng không cập nhật kịp thời nội dung thay đổi của bản Điều khoản điều kiện giao dịch này thông qua các phương thức MSB đã lựa chọn thông báo, niêm yết;</li>
    <li>Không áp dụng đầy đủ các biện pháp hợp lý và cần thiết nhằm đảm bảo an toàn thông tin cá nhân và các thiết bị, dữ liệu máy tính của Khách hàng theo quy định pháp luật và bản Điều khoản điều kiện giao dịch này, bao gồm nhưng không giới hạn các trường hợp cố ý hoặc vô ý tiết lộ thông tin liên quan đến các yếu tố định danh, yếu tố bảo mật của Khách hàng và/hoặc thông tin liên quan đến các giao dịch cho bất kỳ người thứ ba nào; thay đổi thông tin số điện thoại, thiết bị nhận OTP, mã số bảo mật mà không thông báo trước cho MSB; và/hoặc các thông tin cá nhân, thiết bị điện tử của Quý khách bị người khác giả mạo, đánh cắp hoặc sử dụng trái phép dưới bất kỳ hình thức nào, trừ trường hợp do lỗi của MSB;</li>
    <li>Bị tiết lộ thông tin liên quan đến các yếu tố định danh, yếu tố bảo mật và/hoặc thông tin liên quan đến các giao dịch nhưng không xuất phát do lỗi của Khách hàng hay MSB bao gồm nhưng không giới hạn các trường hợp do lỗi của nhà cung cấp dịch vụ viễn thông của Khách hàng hay bất kỳ bên thứ ba nào khác;</li>
    <li>Không thực hiện đúng và đầy đủ theo quy định của pháp luật, quy định tại bản Điều khoản điều kiện giao dịch này, và các thỏa thuận khác giữa Khách hàng và MSB (nếu có).</li>
  </ul>
  <ol>
    <li>MSB</li>
  </ol>
  <ul>
    <li>Từ chối cấp HMTC cho Khách hàng hoặc từ chối cho phép Khách hàng thực hiện/tiếp tục thực hiện bất kỳ hành động nào liên quan đến HMTC được cấp trên Internet Banking, cho dù hành động đó đã và đang được diễn ra; mà theo đánh giá của MSB, những hành động đó có dấu hiệu khả nghi, bất thường, có dấu hiệu gian lận giả mạo hoặc không hợp pháp, hợp lệ theo quy định của MSB và/hoặc quy định pháp luật và/hoặc quy định tại bản Điều khoản điều kiện giao dịch này, bao gồm nhưng không giới hạn các trường hợp Khách hàng trở thành các đối tượng bị hạn chế hoặc bị cấm cấp tín dụng theo quy định pháp luật;</li>
    <li>Tiến hành các hoạt động nâng cấp, bảo trì, bảo dưỡng hệ thống, cơ sở hạ tầng kỹ thuật định kỳ hoặc đột xuất mà có thể dẫn tới việc cung cấp dịch vụ bị gián đoạn, chậm trễ, không liên tục nhưng đã thông báo trước thông qua các phương thức phù hợp với quy định tại bản Điều khoản điều kiện giao dịch này;</li>
    <li>Không thể cung cấp dịch vụ kịp thời, liên tục do (i) MSB tiến hành các hoạt động nâng cấp, bảo trì, bảo dưỡng hệ thống, cơ sở hạ tầng kỹ thuật định kỳ hoặc đột xuất nhưng đã thông báo trước thông qua các phương thức phù hợp với quy định tại bản Điều khoản điều kiện giao dịch này; hoặc (ii) những nguyên nhân ngoài khả năng kiểm soát hợp lý của MSB, bao gồm nhưng không giới hạn các trường hợp hệ thống, hạ tầng kỹ thuật của MSB gặp sự cố xuất phát từ lỗi của Nhà cung cấp dịch vụ của MSB hoặc hệ thống, hạ tầng kỹ thuật của MSB bị xâm phạm, làm hại bởi các loại virus, phần mềm gián điệp, phần mềm quảng cáo hay bất kỳ hành động can thiệp, tấn công mạng nhằm mục đích phá hoại, gây hại nào;</li>
    <li>Thực hiện đơn phương chấm dứt HMTC của Khách hàng theo quy định tại Điểm (b) Khoản 2 Điều 6 bản Điều khoản điều kiện giao dịch này.</li>
    <li>Xảy ra những sự kiện bất khả kháng nằm ngoài khả năng kiểm soát của MSB và trực tiếp gây ra tổn thất, thiệt hại cho Khách hàng và cản trở khả năng của MSB trong quá trình thực hiện các nghĩa vụ đối với Khách hàng, bao gồm nhưng không giới hạn chiến tranh hoặc nội chiến, thiên tai, dịch bệnh, đình công, bãi công, thay đổi pháp luật hoặc các sự kiện bất khả kháng khác theo quy định của pháp luật hoặc theo tuyên bố, yêu cầu của cơ quan nhà nước có thẩm quyền, bất kể (những) sự kiện này phát sinh trong hoặc ngoài Việt Nam.</li>
    <li>Các trường hợp MSB được miễn trách khác theo quy định pháp luật, quy định tại bản Điều khoản điều kiện giao dịch này và các thỏa thuận khác giữa Khách hàng và MSB (nếu có).</li>
  </ul>
  <ol start="7">
    <li>MSB được quyền phát triển các sản phẩm, dịch vụ, tính năng mới trên Internet Banking phù hợp với quy định của pháp luật mà không phải được Khách hàng chấp thuận dưới bất kỳ hình thức nào.</li>
    <li>Các quyền và nghĩa vụ khác theo quy định của pháp luật và quy định tại bản Điều khoản điều kiện giao dịch này và các thỏa thuận khác giữa Khách hàng và MSB (nếu có).</li>
  </ol>
  <ul>
    <li>Thông Báo Và Xử Lý Tra Soát Khiếu Nại</li>
  </ul>
  <ol>
    <li>MSB có quyền gửi thông tin theo quy định tại bản Điều khoản điều kiện giao dịch này cho Khách hàng thông qua một hoặc nhiều phương thức do MSB toàn quyền quyết định bao gồm niêm yết trên Internet Banking; tin nhắn SMS, địa chỉ email theo thông tin Khách đã đăng ký khi đề nghị mở HMTC trên Internet Banking.</li>
    <li>Thông báo được coi là đã gửi và Khách hàng đã nhận thành công khi thông báo đó (a) được gửi trực tiếp tới tay Khách hàng hoặc người đại diện hợp pháp của Khách hàng; và/hoặc (b) được gửi theo dịch vụ bưu chính có bảo đảm theo xác nhận của cơ quan bưu chính; và/hoặc (c) vào ngày được niêm yết chính thức trên Internet Banking; và/hoặc (d) gửi qua địa chỉ email Khách hàng đã đăng ký trên Internet Banking.
      <ol start="3">
        <li>Mọi thông tin giải đáp, Quý khách liên hệ tới Bộ phận chăm sóc khách hàng:
          <ol>
            <li>Hotlines: 1800 599 999</li>
            <li>Email: CSKHCaNhan@msb.com.vn</li>
          </ol>
        </li>
        <li>Việc tiếp nhận, phối hợp xử lý các tra soát, khiếu nại của Khách hàng thực hiện theo quy định chi tiết tại bản Điều khoản điều kiện giao dịch chung dịch vụ ngân hàng điện tử.</li>
      </ol>
    </li>
  </ol>
  <ul>
    <li>Điều Khoản Phòng Chống Tham Nhũng Và Tuân Thủ Pháp Luật</li>
  </ul>
  <h3>Trong quá trình cung cấp và sử dụng dịch vụ, MSB và Khách hàng cam kết luôn tuân thủ pháp luật, gồm cả Luật Phòng, chống tham nhũng (như không đưa/nhận hối lộ, tham ô, tham nhũng); chịu hoàn toàn trách nhiệm trước pháp luật và bồi thường thiệt hại cho các Bên liên quan (nếu có) khi vi phạm cam kết này.</h3>
  <ul>
    <li>Luật Điều Chỉnh Và Giải Quyết Tranh Chấp.</li>
  </ul>
  <ol>
    <li>Bản Điều khoản điều kiện giao dịch này được điều chỉnh bởi pháp luật Việt Nam.</li>
    <li>Trong trường hợp có tranh chấp xảy ra, hai Bên sẽ cùng nhau giải quyết trên tinh thần thương lượng hợp tác để cùng nhau tìm ra hướng giải quyết có lợi cho cả hai Bên. Nếu không thể thương lượng và giải quyết tranh chấp được trong thời hạn ba mươi (30) ngày kể từ ngày phát sinh tranh chấp thì một trong các bên có quyền đưa tranh chấp ra giải quyết bằng phương thức trọng tài tại Trung tâm Trọng tài Quốc tế Việt Nam (VIAC) bên cạnh Phòng Thương mại và Công nghiệp Việt Nam theo Quy tắc tố tụng trọng tài của Trung tâm này với:</li>
    <li>Số lượng trọng tài viên là ba (03);</li>
    <li>Địa điểm trọng tài là thành phố Hà Nội, Việt Nam;</li>
    <li>Ngôn ngữ trọng tài là tiếng Việt.</li>
    <li>Bên thua kiện có nghĩa vụ thanh toán các khoản phí, lệ phí liên quan đến thủ tục tố tụng, bao gồm cả chi phí thuê luật sư (nếu có) mà Bên kia phải bỏ ra để giải quyết vụ kiện.</li>
  </ol>
  <p> </p>
  `;

  const dispatch = useDispatch()

  const { sendOTPRegister, sendOTPOnly, sendOTPOnlyError } = useSelector((state) => state.overdraft)
  const [checked, setCheck] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSetup, setIsSetup] = useState(false)

  const onVerify = () => {

    const body = {
      ...sendOTPRegister
    }
    setLoading(true)
    setIsSetup(true)
    dispatch(odSavingOperations.sendOtpOnly(body))
  }

  React.useEffect(() => {
    setLoading(false)
    if (isSetup && sendOTPOnly) {
      setIsSetup(false)
      Navigation.push('CreateODVerify', { title: 'CreateODVerify' })  
    }
  }, [sendOTPOnly])

  React.useEffect(() => {
    setLoading(false)
    setIsSetup(false)
  }, [sendOTPOnlyError])

  return (
    <Fragment>
      <Topbar subTitle={I18n.t('overdraft.fromOnlineSaving.openScreenTitle')} background={Colors.mainBg} title={I18n.t('overdraft.fromOnlineSaving.title')} />
      <View style={[Helpers.fill, styles.container]}>
        <ScrollView
          style={Helpers.fullWidth}
          showsVerticalScrollIndicator={false}
          extraHeight={300}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{I18n.t('overdraft.fromOnlineSaving.conditionTitle').toUpperCase()}</Text>
          </View>
          <View style={[styles.line, { marginBottom: Metrics.small }]} />

          <HTML
            ignoredStyles={[...IGNORED_TAGS, 'font-family']}
            baseFontStyle={{
              fontSize: Utils.getRatioDimension(14),
            }}
            source={{ html: htmlContent }}
            // html={htmlContent}
          />
        </ScrollView>
        <View style={styles.line} />
        <Radio
          size={Utils.getRatioDimension(18)}
          style={[styles.checkBox]}
          textStyle={styles.textCheckBox}
          text={I18n.t('overdraft.text_condition')}
          checked={checked}
          onPress={() => {
            setCheck(!checked)
          }}
        />
      </View>

      <ConfirmButton
        onPress={() => onVerify()}
        disabled={!checked}
        color={!checked ? Colors.gray4 : Colors.primary2}
      />
      <Loader modalVisible={loading} />
    </Fragment>
  )
}

export default CreateODConfirm
