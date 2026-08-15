import 'package:flutter_test/flutter_test.dart';
import 'package:blazebyte_app/main.dart';

void main() {
  testWidgets('App loads', (WidgetTester tester) async {
    await tester.pumpWidget(const BlazeByteApp());

    expect(find.text('Blaze Byte Studio'), findsOneWidget);
  });
}
