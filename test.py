def set_visualization_list(data, *args, **kwargs):
    slug = data.get('slug', None)
    if slug is None:
        return {'message': 'Bad data'}
        splited_list = data.get("visualization_list", "").split(",")
        visualization_list = (
            len(splited_list) > 0
            and not splited_list[0] == ""
            and [int(x) for x in splited_list]
            or []
            )
            dashboard, status = send_request_with_headers(POST_DASHBOARDS + slug)
            if not status:
                return {'message': 'Bad response'}
                for widget in dashboard['widgets']:
                    send_request_with_headers('widgets/' + str(widget['id']), delete=True)
                    for i, visualization in enumerate(visualization_list):
                        context = {
                            'dashboard_id': dashboard['id'],
                            'visualization_id': visualization,
                            'width': 1,
                            'options': {
                                'position': {
                                    'col': 0,
                                    'row': i * 3,
                                    'sizeX': 6,
                                    'sizeY': 8,
                                    }
                                    }
                                    }
                                    send_request_with_headers('widgets', context=context)
                                    dashboard, status = send_request_with_headers(POST_DASHBOARDS + slug)