import React from 'react'
import { StyleSheet, View, ImageBackground, Image, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native'
import HTML from 'react-native-render-html';
import { ScrollView } from 'react-native-gesture-handler';
import I18n from '../../translations'
import { Images, Colors, Metrics, Helpers } from '../../theme'
import { Utils } from '../../utilities'
import { Text } from '../../components'
import * as Navigation from '../../navigation'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  text: {
    color: Colors.white,
    fontSize: 20,
    alignSelf: 'center'
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: Metrics.normal,
    borderBottomWidth: 1,
    borderBottomColor: Colors.white,
    marginTop: Metrics.normal
  },
  title: {
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: Utils.getWindowWidth() / 1.6
  },
  close: {
    width: '10%',
    alignItems: 'center',
    margin: Metrics.normal
  }
})

const Policy = () => {
  const htmlContent = `
  <div>
  <div class="title">Điều 1. Nguyên Tắc Áp Dụng</div>
    <div class="content">1. Bản Điều khoản điều kiện giao dịch chung cho dịch vụ mở tài khoản thanh toán online trên ứng dụng Mobile Banking này (“Điều khoản điều kiện giao dịch”) điều chỉnh mối quan hệ giữa KH với MSB khi KH mở và sử dụng tài khoản thanh toán qua ứng dụng Mobile Banking mà không phải trực tiếp đến các điểm giao dịch của MSB để thực hiện (“TKTT online”).</div>
    <div class="content">2. Đối với việc mở và sử dụng TKTT online, bản Điều khoản điều kiện giao dịch này cùng với (i) bản Điều khoản điều kiện giao dịch chung dịch vụ tài khoản thanh toán và thẻ ghi nợ và (ii) bản Điều khoản điều kiện giao dịch chung dịch vụ ngân hàng điện tử và (iii) Giấy đề nghị kiêm hợp đồng mở, sử dụng tài khoản và đăng ký dịch vụ (nếu có), tạo thành một thỏa thuận hoàn chỉnh, không tách rời, có giá trị pháp lý như một bản hợp đồng/thỏa thuận mở và sử dụng tài khoản thanh toán. Để tránh hiểu nhầm, việc nhắc đến thuật ngữ Điều khoản điều kiện giao dịch được hiểu rằng đã bao gồm tất cả các văn kiện giao dịch được đề cập ở trên.</div>
    <div class="content">3. KH vui lòng đọc kỹ bản Điều khoản điều kiện giao dịch này, bản Điều khoản điều kiện giao dịch chung dịch vụ tài khoản thanh toán và thẻ ghi nợ và bản Điều khoản điều kiện giao dịch chung dịch vụ ngân hàng điện tử <a style="color: ${Colors.second2}" href="https://www.msb.com.vn/Bieu-mau-Bieu-phi-va-Lai-suat/1842/1/Bieu-mau">https://www.msb.com.vn/Bieu-mau-Bieu-phi-va-Lai-suat/1842/1/Bieu-mau</a> trước khi xác nhận thông tin. Việc KH lựa chọn tích chọn và xác nhận ĐỒNG Ý với thông tin đăng tải trên Mobile Banking được hiểu là KH đã đọc, đã được giải thích đầy đủ, chi tiết và đồng ý với nội dung bản Điều khoản điều kiện giao dịch này.</div>
    <div class="content">4. Các thuật ngữ viết hoa nếu không được định nghĩa tại bản Điều khoản điều kiện giao dịch này được hiểu rằng đã được định nghĩa tại các bản Điều khoản điều kiện giao dịch chung dịch vụ tài khoản thanh toán và thẻ ghi nợ và bản Điều khoản điều kiện giao dịch chung dịch vụ ngân hàng điện tử.</div>
    <div class="content">5. Các nội dung không được quy định tại bản Điều khoản điều kiện giao dịch này thực hiện theo quy định tại các bản Điều khoản điều kiện giao dịch chung dịch vụ tài khoản thanh toán và thẻ ghi nợ và bản Điều khoản điều kiện giao dịch chung dịch vụ ngân hàng điện tử. Để tránh hiểu nhầm, trường hợp có bất kỳ nội dung mâu thuẫn nào giữa bản Điều khoản điều kiện giao dịch này với các bản điều khoản điều kiện nêu trên thì ưu tiên áp dụng nội dung của bản Điều khoản điều kiện giao dịch này.</div>
    <div class="content">6. Trong quá trình sử dụng dịch vụ, KH đồng ý rằng MSB có quyền đơn phương sửa đổi, bổ sung nội dung bản Điều khoản điều kiện giao dịch này trên cơ sở phù hợp với quy định Pháp luật và MSB sẽ niêm yết công khai trên website www.msb.com.vn và/hoặc tại các điểm giao dịch của MSB. Việc KH tiếp tục sử dụng dịch vụ sau thời điểm hiệu lực của bản Điều khoản điều kiện đã được sửa đổi, bổ sung được hiểu là KH đã chấp thuận các sửa đổi, bổ sung đó.</div>
  </div>

  <div class="title">Điều 2. Nguyên Tắc Mở Và Sử Dụng Tài Khoản Thanh Toán Online</div>
    <div class="content">1. KH phải tự thực hiện giao dịch mở TKTT online và không được ủy quyền cho người khác sử dụng TKTT online trừ trường hợp KH đã hoàn thiện thủ tục nhận biết, xác minh thông tin tại các điểm giao dịch của MSB theo quy định của MSB từng thời kỳ.</div>
    <div class="content">2. Tại thời điểm mở TKTT online, KH phải đảm bảo đồng thời các điều kiện:<br>
a. chưa từng có tài khoản thanh toán tại MSB;<br>
b. là công dân có quốc tịch duy nhất là Việt Nam, từ 18 tuổi trở lên và có năng lực hành vi dân sự đầy đủ theo quy định pháp luật Việt Nam;<br>
c. không phải là công dân Hoa Kỳ hoặc là người được cấp thẻ thường trú nhân (Thẻ xanh) tại Hoa Kỳ hoặc là cá nhân cư trú tại Hoa Kỳ;<br>
d. là chủ sở hữu hưởng lợi cuối cùng và duy nhất đối với TKTT online được mở; và<br>
e. không tham gia bất kỳ thỏa thuận pháp lý nào.
    </div>
    <div class="content">3. KH chỉ được sử dụng TKTT online trong phạm vi các loại giao dịch và Hạn mức giao dịch đối với TKTT online được MSB chấp thuận trong từng thời kỳ phù hợp với quy định của pháp luật. Trường hợp KH đã hoàn thiện thủ tục nhận biết, xác minh thông tin tại các điểm giao dịch của MSB, KH được sử dụng TKTT online trong phạm vi các loại giao dịch và Hạn mức giao dịch đối với TK thông thường theo quy định của MSB từng thời kỳ. Thông tin về các loại giao dịch và Hạn mức giao dịch theo quy định tại Khoản này và bất kỳ sự thay đổi nào liên quan đến các thông tin nêu trên sẽ được MSB niêm yết công khai trên website www.msb.com.vn và/hoặc tại các điểm giao dịch của MSB. Việc KH tiếp tục sử dụng dịch vụ sau thời điểm hiệu lực của bản Điều khoản điều kiện giao dịch đã được sửa đổi, bổ sung được hiểu là KH đã chấp thuận các sửa đổi, bổ sung đó.</div>

    <div class="title">Điều 3. Quyền Và Nghĩa Vụ Của KH</div>
    <div class="content">1. KH có trách nhiệm thực hiện, tuân thủ đúng và đầy đủ bản Điều khoản điều kiện giao dịch và các hướng dẫn, yêu cầu khác của MSB hiển thị trên Mobile Banking, trên website www.msb.com.vn, tại các điểm giao dịch của MSB (nếu có), trên các kênh giao dịch điện tử khác (nếu có) và/hoặc tại các thông báo MSB gửi thành công tới KH liên quan tới việc nhận biết, xác minh thông tin nhận biết KH, mở và sử dụng TKTT online. KH đồng ý từ bỏ mọi quyền khiếu nại, khiếu kiện của mình đối với bất kỳ hành động cần thiết nào của MSB liên quan tới việc KH không thực hiện đúng và đầy đủ bản Điều kiện điều khoản giao dịch và các hướng dẫn, yêu cầu khác của MSB, bao gồm nhưng không giới hạn việc từ chối cung cấp dịch vụ, tạm khóa, phong tỏa TKTT online và yêu cầu xác minh lại thông tin nhận biết KH nếu phát hiện có rủi ro, sai lệch hoặc có dấu hiệu bất thường giữa các thông tin nhận biết KH.</div>
    <div class="content">2. KH có trách nhiệm cung cấp đầy đủ và đảm bảo tính chân thực, khớp đúng, chính xác giữa các thông tin nhận biết cá nhân mà KH (bao gồm nhưng không giới hạn các yếu tố sinh trắc học) với các yếu tố, thông tin trên giấy tờ tùy thân của KH (căn cước công dân/chứng minh nhân dân còn thời hạn). KH hoàn toàn chịu trách nhiệm trước pháp luật và miễn trừ toàn bộ trách nhiệm cho MSB đối với bất kỳ tranh chấp và/hoặc hành vi vi phạm pháp luật nào xuất phát từ việc KH cung cấp thông tin không trung thực, không khớp đúng và không chính xác, vì bất cứ lý do gì. Việc KH cung cấp thông tin cho MSB theo quy định tại bản Điều khoản điều kiện giao dịch này được hiểu bao gồm cả việc cung cấp thông tin cho Nhà cung cấp dịch vụ do MSB chỉ định để thực hiện một phần hoặc toàn bộ việc xác mình thông tin KH phù hợp theo quy định pháp luật.</div>
    <div class="content">3. KH thừa nhận có trách nhiệm chủ động thường xuyên, liên tục tự theo dõi, cập nhật nội dung bản Điều khoản điều kiện giao dịch này và các thông tin khác liên quan đến các sản phẩm, dịch vụ do MSB cung cấp trên website www.msb.com.vn và/hoặc tại các điểm giao dịch của MSB và/hoặc Mobile Banking hoặc bằng các phương thức truyền thông khác. KH cũng cam kết từ bỏ mọi quyền khiếu nại, khiếu kiện đối với MSB trong trường hợp vì bất kỳ lí do nào KH không thể cập nhật kịp thời nội dung sửa đổi, bổ sung của bản Điều khoản điều kiện giao dịch này, trừ trường hợp việc chậm trễ đó phát sinh do lỗi của MSB. Trường hợp không đồng ý với nội dung Điều khoản điều kiện sửa đổi, bổ sung, KH có quyền chấm dứt việc sử dụng dịch vụ sau khi đã hoàn thành các nghĩa vụ với MSB phù hợp với quy định tại bản Điều khoản điều kiện giao dịch này và thỏa thuận khác (nếu có) giữa KH và MSB. Thông tin về các loại giao dịch và Hạn mức giao dịch theo quy định tại Khoản này và bất kỳ sự thay đổi nào liên quan đến các thông tin nêu trên sẽ được MSB niêm yết công khai trên website www.msb.com.vn và/hoặc tại các điểm giao dịch của MSB. Việc KH tiếp tục sử dụng dịch vụ sau thời điểm hiệu lực của bản Điều khoản điều kiện giao dịch đã được sửa đổi, bổ sung được hiểu là KH đã chấp thuận các sửa đổi, bổ sung đó.</div>
    <div class="content">4. KH có các quyền và nghĩa vụ khác theo quy định của pháp luật, quy định tại bản Điều khoản điều kiện giao dịch này và các thỏa thuận khác giữa KH và MSB (nếu có).</div>

    <div class="title">Điều 4. Quyền Và Nghĩa Vụ Của MSB</div>
    <div class="content">1. MSB có nghĩa vụ cung cấp dịch vụ cho KH phù hợp với quy định pháp luật và quy định tại bản Điều khoản điều kiện giao dịch này.</div>
    <div class="content">2. MSB có quyền chủ động thực hiện các hành động MSB cho là cần thiết phù hợp với quy định pháp luật và quy định của MSB nếu KH không thực hiện, không tuân thủ đúng và đầy đủ theo các hướng dẫn, yêu cầu của MSB trên Mobile Banking liên quan tới việc nhận biết, xác minh thông tin nhận biết KH, mở và sử dụng TKTT online, bao gồm nhưng không giới hạn việc từ chối cung cấp dịch vụ, tạm khóa, phong tỏa TKTT online và yêu cầu xác minh lại thông tin nhận biết KH nếu phát hiện có rủi ro, sai lệch hoặc có dấu hiệu bất thường giữa các thông tin nhận biết KH.</div>
    <div class="content">3. MSB có quyền sửa đổi, bổ sung nội dung bản Điều khoản điều kiện giao dịch này trên cơ sở phù hợp với quy định pháp luật và MSB sẽ niêm yết công khai trên website www.msb.com.vn và/hoặc tại các điểm giao dịch của MSB.</div>
    <div class="content">4. MSB có quyền chủ động thay đổi danh mục các loại giao dịch và Hạn mức giao dịch được phép thực hiện đối với TKTT online trong từng thời kỳ phù hợp với quy định pháp luật mà không cần KH chấp thuận dưới bất kỳ hình thức nào. MSB sẽ niêm yết thông tin công khai trên website www.msb.com.vn và/hoặc tại các điểm giao dịch của MSB. Việc KH tiếp tục sử dụng dịch vụ sau thời điểm thông tin thay đổi được niêm yết và có hiệu lực được hiểu là KH đã chấp thuận các sửa đổi, bổ sung đó.</div>
    <div class="content">5. MSB có quyền chỉ định bất kỳ Nhà cung cấp dịch vụ nào của MSB để thực hiện việc nhận biết, xác minh thông tin nhận biết KH phù hợp theo quy định pháp luật mà không cần KH chấp thuận hay không có nghĩa vụ phải thông báo cho KH, dưới bất kỳ hình thức nào.<br>Để tránh hiểu lầm, việc MSB cung cấp thông tin liên quan tới KH cho Nhà cung cấp dịch vụ của MSB như nêu trên không bị coi là vi phạm nghĩa vụ về bảo mật thông tin theo quy định tại bản
    Điều khoản điều kiện giao dịch này.</div>
    <div class="content">6. MSB có các quyền và nghĩa vụ khác theo quy định của pháp luật, quy định tại bản Điều khoản điều kiện giao dịch này và các thỏa thuận khác giữa KH và MSB (nếu có).</div>

    <div class="title">Điều 5. Điều Khoản Miễn Trách</div>
    <div class="content">MSB không chịu bất kỳ trách nhiệm nào, bao gồm cả trách nhiệm thanh toán các khoản phạt, bồi thường thiệt hại, bồi hoàn hay bất kỳ chi phí liên quan nào đối với những thiệt hại, tổn thất của KH phát sinh do:</div>
    <div class="content">1. KH <br>
a. vì bất kỳ lý do gì không nhận được hoặc không tiếp cận (các) thông báo đã được MSB gửi đi thành công, bao gồm nhưng không giới hạn các trường hợp do thiết bị di động, phần mềm trên thiết bị di động hoặc Nhà cung cấp dịch vụ của KH không đảm bảo khả năng kết nối Mobile Banking ổn định, liên tục; KH không cập nhật kịp thời nội dung thay đổi của bản Điều khoản điều kiện giao dịch này thông qua các phương thức MSB đã lựa chọn thông báo, niêm yết; và/hoặc KH không đăng ký thay đổi thông tin liên hệ với MSB theo quy định tại bản Điều khoản điều kiện giao dịch này;<br>
b. không áp dụng đầy đủ các biện pháp hợp lý và cần thiết nhằm đảm bảo an toàn thông tin cá nhân và các thiết bị di động, phần mềm trên thiết bị di động của KH theo quy định pháp luật và bản Điều khoản điều kiện giao dịch này, bao gồm nhưng không giới hạn các trường hợp cố ý hoặc vô ý tiết lộ thông tin liên quan đến các yếu tố định danh, yếu tố bảo mật của KH và/hoặc thông tin liên quan đến các giao dịch cho bất kỳ người thứ ba nào; thay đổi thông tin số điện thoại, thiết bị nhận OTP mà không thông báo trước cho MSB; và/hoặc các thông tin cá nhân, thiết bị điện tử của KH bị người khác giả mạo, đánh cắp hoặc sử dụng trái phép dưới bất kỳ hình thức nào, trừ trường hợp do lỗi của MSB;<br>
c. bị tiết lộ thông tin liên quan đến các yếu tố định danh, yếu tố bảo mật và/hoặc thông tin liên quan đến các giao dịch nhưng không xuất phát do lỗi của KH hay MSB bao gồm nhưng không giới hạn các trường hợp do lỗi của nhà cung cấp dịch vụ viễn thông của KH hay bất kỳ bên thứ ba nào khác;<br>
d. không duy trì đủ số dư khả dụng trên TKTT online theo quy định của MSB để thực hiện giao dịch theo yêu cầu của KH;<br>
e. KH không đảm bảo khả năng ngoại ngữ khi sử dụng TKTT online và các dịch vụ thuộc phạm vi điều chỉnh của bản Điều khoản điều kiện giao dịch này đẫn đến nhầm lẫn khi thực hiện các thao tác, các lệnh giao dịch cho dù các thao tác, các lệnh giao dịch đó là hợp lệ, bao gồm nhưng không giới hạn trường hợp ngôn ngữ trên giao diện thiết bị di động, phần mềm trên thiết bị di động không trùng khớp với ngôn ngữ trên giao diện Mobile Banking hoặc sử dụng ngôn ngữ trên giao diện Mobile Banking không phải tiếng Việt.<br>
f. không thực hiện đúng và đầy đủ theo quy định của pháp luật, quy định tại bản Điều khoản điều kiện giao dịch này, bản Điều khoản điều kiện giao dịch chung dịch vụ tài khoản thanh toán và thẻ ghi nợ, bản Điều khoản điều kiện giao dịch chung dịch vụ ngân hàng điện tử, Giấy đề nghị kiêm hợp đồng mở, sử dụng tài khoản và đăng ký dịch vụ (nếu có) và các thỏa thuận khác giữa KH và MSB (nếu có).<br>
    </div>
    <div class="content">2. MSB<br>
a. từ chối thực hiện các giao dịch, mà theo đánh giá của MSB, có dấu hiệu khả nghi, bất thường, có dấu hiệu gian lận giả mạo hoặc không hợp pháp, hợp lệ theo quy định của MSB và quy định pháp luật. Để làm rõ hơn, các giao dịch không hợp pháp, hợp lệ theo quy định tại Khoản này bao gồm cả các giao dịch đang thuộc đối tượng tranh chấp, khiếu nại, khiếu kiện hoặc các giao dịch có thể chứa đựng yếu tố rủi ro vượt quá khả năng kiểm soát và khẩu vị rủi ro của MSB;<br>
b. tiến hành các hoạt động nâng cấp, bảo trì, bảo dưỡng hệ thống, cơ sở hạ tầng kỹ thuật định kỳ hoặc đột xuất mà có thể dẫn tới việc cung cấp dịch vụ bị gián đoạn, chậm trễ, không liên tục nhưng đã thông báo trước thông qua các phương thức phù hợp với quy định tại bản Điều khoản điều kiện giao dịch này;<br>
c. không thể cung cấp dịch vụ kịp thời, liên tục do (i) MSB tiến hành các hoạt động nâng cấp, bảo trì, bảo dưỡng hệ thống, cơ sở hạ tầng kỹ thuật định kỳ hoặc đột xuất nhưng đã thông báo trước thông qua các phương thức phù hợp với quy định tại bản Điều khoản điều kiện giao dịch này; hoặc (ii) những nguyên nhân ngoài khả năng kiểm soát hợp lý của MSB, bao gồm nhưng không giới hạn các trường hợp hệ thống, hạ tầng kỹ thuật của MSB gặp sự cố xuất phát từ lỗi của Nhà cung cấp dịch vụ của MSB hoặc hệ thống, hạ tầng kỹ thuật của MSB bị xâm phạm, làm hại bởi các loại virus, phần mềm gián điệp, phần mềm quảng cáo hay bất kỳ hành động can thiệp, tấn công mạng nhằm mục đích phá hoại, gây hại nào;<br>
d. đã thực hiện đúng và đầy đủ theo nội dung các lệnh thanh toán, yêu cầu giao dịch hợp lệ của KH phù hợp với quy định tại bản Điều khoản điều kiện giao dịch này, bao gồm cả trường hợp KH ủy quyền cho MSB định kỳ hoặc tại từng thời điểm thay mặt KH thực hiện các lệnh thanh toán, yêu cầu giao dịch;</div>
    <div class="content">3. Xảy ra những sự kiện bất khả kháng nằm ngoài khả năng kiểm soát của MSB và trực tiếp gây ra tổn thất, thiệt hại cho KH và cản trở khả năng của MSB trong quá trình thực hiện các nghĩa vụ đối với KH, bao gồm nhưng không giới hạn chiến tranh hoặc nội chiến, thiên tai, dịch bệnh, đình công, bãi công, thay đổi pháp luật hoặc các sự kiện bất khả kháng khác theo quy định của pháp luật hoặc theo tuyên bố của cơ quan nhà nước có thẩm quyền, bất kể (những) sự kiện này phát sinh trong hoặc ngoài Việt Nam.</div>
    <div class="content">4. Các trường hợp MSB được miễn trách khác theo quy định pháp luật, quy định tại bản Điều khoản điều kiện giao dịch này và các thỏa thuận khác giữa KH và MSB (nếu có).</div>

    <div class="title">Điều 6. Luật Điều Chỉnh Và Giải Quyết Tranh Chấp.</div>
    <div class="content">1. Bản Điều khoản điều kiện giao dịch này được điều chỉnh bởi pháp luật Việt Nam.</div>
    <div class="content">2. Trong trường hợp có tranh chấp xảy ra, hai Bên sẽ cùng nhau giải quyết trên tinh thần thương lượng hợp tác để cùng nhau tìm ra hướng giải quyết có lợi cho cả hai Bên. Nếu không thể thương lượng và giải quyết tranh chấp được trong thời hạn ba mươi (30) ngày kể từ ngày phát sinh tranh chấp thì một trong các bên có quyền đưa tranh chấp ra giải quyết bằng phương thức trọng tài tại Trung tâm Trọng tài Quốc tế Việt Nam (VIAC) bên cạnh Phòng Thương mại và Công nghiệp Việt Nam theo Quy tắc tố tụng trọng tài của Trung tâm này với:<br>
a) số lượng trọng tài viên là ba (03);<br>
b) địa điểm trọng tài là thành phố Hà Nội, Việt Nam;<br>
c) ngôn ngữ trọng tài là tiếng Việt.<br>
    </div>
    <div class="content">3. Bên thua kiện có nghĩa vụ thanh toán các khoản phí, lệ phí liên quan đến thủ tục tố tụng, bao gồm cả chi phí thuê luật sư (nếu có) mà Bên kia phải bỏ ra để giải quyết vụ kiện.</div>
  </div>
`;
const classesStyles = {
  title: {
    color: Colors.white,
    paddingVertical: 10,
    fontWeight: 'bold',
    fontSize: 14
  },
  content: {
    color: Colors.white,
    fontSize: 14,
    textAlign: 'justify'
  },

}
  const onClose = () => {
    Navigation.pop()
  }

  const onLinkPress = (event, href) => {
    console.log('====================================');
    console.log(href);
    console.log('====================================');
    Utils.openUrl(href)
  }
  return (
    <View style={styles.container}>
      <ImageBackground source={Images.bgHome} style={styles.image}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <SafeAreaView style={{ flex: 1, marginHorizontal: Metrics.normal, }}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
              <TouchableOpacity onPress={onClose} style={styles.close}>
                <Text style={{ color: Colors.white }}>X</Text>
              </TouchableOpacity>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{'Điều kiện & điều khoản mở tài khoản thanh toán online'.toLocaleUpperCase()}</Text>
              </View>
              <HTML
                classesStyles={classesStyles}
                html={htmlContent}
                imagesMaxWidth={Dimensions.get('window').width}
                onLinkPress={onLinkPress}
                textSelectable
              />
            </ScrollView>
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  )
}

export default Policy
